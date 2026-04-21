-- MindReset Kathu — triggers, helper functions, RPCs
-- Depends on 0001_init.sql

-- ---------------------------------------------------------------
-- updated_at trigger function
-- ---------------------------------------------------------------
create or replace function public.tg_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.tg_set_updated_at();

create trigger journal_entries_set_updated_at
  before update on public.journal_entries
  for each row execute function public.tg_set_updated_at();

-- ---------------------------------------------------------------
-- handle_new_user: create a profile row whenever an auth user is created
-- ---------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_default_cohort uuid;
  v_handle         text;
begin
  select id into v_default_cohort from public.cohorts where slug = 'crc-kathu-youth-2026' limit 1;

  -- Generate a friendly anonymous handle like "Kathu Lion 3421"
  v_handle := 'Kathu ' || (array['Lion','Eagle','Flame','River','Star','Ember','Comet','Cheetah','Mountain','Thunder'])[floor(random()*10+1)::int]
              || ' ' || lpad(floor(random()*9999)::text, 4, '0');

  insert into public.profiles (id, display_name, cohort_id)
  values (new.id, v_handle, v_default_cohort);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------
-- is_leader_of: used inside RLS policies
-- ---------------------------------------------------------------
create or replace function public.is_leader_of(c uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.cohort_id = c
      and p.role in ('leader','admin')
  );
$$;

-- ---------------------------------------------------------------
-- award_badges_for_user: evaluates badge rules and inserts any that
-- haven't been earned yet. Returns an array of newly earned badge ids.
-- ---------------------------------------------------------------
create or replace function public.award_badges_for_user(p_user_id uuid)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_quest_count   integer;
  v_journal_count integer;
  v_streak        integer;
  v_weeks_done    smallint[];
  v_new           text[] := array[]::text[];
  v_awarded       boolean;

  procedure add_badge(b text) language plpgsql as $inner$
  begin
    insert into public.user_badges (user_id, badge_id)
    values (p_user_id, b) on conflict do nothing;
    if found then
      v_new := array_append(v_new, b);
      insert into public.xp_events (user_id, amount, reason, ref_type, ref_id)
      select p_user_id, xp_reward, 'badge_awarded', 'badge', id
      from public.badges where id = b and xp_reward > 0;
    end if;
  end;
  $inner$;
begin
  select count(*) into v_quest_count   from public.quest_completions where user_id = p_user_id;
  select count(*) into v_journal_count from public.journal_entries   where user_id = p_user_id;
  select current_streak into v_streak  from public.profiles where id = p_user_id;

  -- First reset
  if v_quest_count >= 1 then
    insert into public.user_badges (user_id, badge_id)
    values (p_user_id, 'first-reset') on conflict do nothing;
    if found then v_new := array_append(v_new, 'first-reset'); end if;
  end if;

  -- Streak tiers
  if v_streak >= 2 then
    insert into public.user_badges (user_id, badge_id) values (p_user_id, 'flame-spark') on conflict do nothing;
    if found then v_new := array_append(v_new, 'flame-spark'); end if;
  end if;
  if v_streak >= 3 then
    insert into public.user_badges (user_id, badge_id) values (p_user_id, 'flame-steady') on conflict do nothing;
    if found then v_new := array_append(v_new, 'flame-steady'); end if;
  end if;
  if v_streak >= 7 then
    insert into public.user_badges (user_id, badge_id) values (p_user_id, 'flame-blaze') on conflict do nothing;
    if found then v_new := array_append(v_new, 'flame-blaze'); end if;
  end if;
  if v_streak >= 14 then
    insert into public.user_badges (user_id, badge_id) values (p_user_id, 'flame-inferno') on conflict do nothing;
    if found then v_new := array_append(v_new, 'flame-inferno'); end if;
  end if;

  -- Week completion (≥ 6 completions for a given week)
  for i in 1..7 loop
    if (select count(*) from public.quest_completions where user_id = p_user_id and week_number = i) >= 6 then
      insert into public.user_badges (user_id, badge_id)
      values (p_user_id, 'week-'||i||'-done') on conflict do nothing;
      if found then v_new := array_append(v_new, 'week-'||i||'-done'); end if;
    end if;
  end loop;

  -- Full series
  if (select count(distinct week_number) from public.quest_completions where user_id = p_user_id) = 7 then
    insert into public.user_badges (user_id, badge_id) values (p_user_id, 'reset-complete') on conflict do nothing;
    if found then v_new := array_append(v_new, 'reset-complete'); end if;
  end if;

  -- Scribe
  if v_journal_count >= 10 then
    insert into public.user_badges (user_id, badge_id) values (p_user_id, 'scribe') on conflict do nothing;
    if found then v_new := array_append(v_new, 'scribe'); end if;
  end if;

  return v_new;
end;
$$;

-- ---------------------------------------------------------------
-- complete_quest: the single RPC clients call to finish a daily quest.
-- Inserts completion (idempotent), updates streak + XP, awards badges.
-- ---------------------------------------------------------------
create or replace function public.complete_quest(
  p_week      smallint,
  p_day       smallint,
  p_duration  integer,
  p_client_id text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id   uuid := auth.uid();
  v_awarded   integer := 25;
  v_streak    integer;
  v_today     date := (now() at time zone 'Africa/Johannesburg')::date;
  v_last      date;
  v_new_badges text[];
  v_already_done boolean;
begin
  if v_user_id is null then
    raise exception 'not authenticated';
  end if;
  if p_week not between 1 and 7 then raise exception 'invalid week'; end if;
  if p_day  not between 1 and 7 then raise exception 'invalid day';  end if;

  -- Idempotency: did this completion already exist?
  select exists (
    select 1 from public.quest_completions
    where user_id = v_user_id and week_number = p_week and day_number = p_day
  ) into v_already_done;

  insert into public.quest_completions (user_id, week_number, day_number, duration_seconds, client_id)
  values (v_user_id, p_week, p_day, p_duration, p_client_id)
  on conflict (user_id, week_number, day_number) do nothing;

  if v_already_done then
    -- No XP, no streak change on replay
    return json_build_object('xp_awarded', 0, 'replay', true);
  end if;

  -- Streak logic
  select last_quest_completed_on, current_streak into v_last, v_streak
  from public.profiles where id = v_user_id for update;

  if v_last is null or v_last < v_today - 1 then
    v_streak := 1;
  elsif v_last = v_today - 1 then
    v_streak := v_streak + 1;
  end if;

  update public.profiles
     set total_xp = total_xp + v_awarded,
         current_streak = v_streak,
         longest_streak = greatest(longest_streak, v_streak),
         last_quest_completed_on = v_today,
         updated_at = now()
   where id = v_user_id;

  insert into public.xp_events (user_id, amount, reason, ref_type, ref_id)
  values (v_user_id, v_awarded, 'quest_complete', 'quest', p_week::text || ':' || p_day::text);

  v_new_badges := public.award_badges_for_user(v_user_id);

  return json_build_object(
    'xp_awarded',    v_awarded,
    'current_streak', v_streak,
    'new_badges',    v_new_badges,
    'replay',        false
  );
end;
$$;

-- Allow authenticated users to call the RPC
grant execute on function public.complete_quest(smallint, smallint, integer, text) to authenticated;
grant execute on function public.is_leader_of(uuid) to authenticated;
