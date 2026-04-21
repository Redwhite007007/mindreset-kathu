-- MindReset Kathu — Row Level Security policies
-- Depends on 0001_init.sql and 0002_triggers_and_rpcs.sql

-- ---------------------------------------------------------------
-- cohorts (read-only for authenticated users)
-- ---------------------------------------------------------------
alter table public.cohorts enable row level security;

create policy "cohorts: authed read"
  on public.cohorts for select to authenticated
  using (true);

-- ---------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles: self read"
  on public.profiles for select to authenticated
  using (id = auth.uid());

create policy "profiles: cohort read"
  on public.profiles for select to authenticated
  using (
    cohort_id is not null
    and cohort_id = (select cohort_id from public.profiles where id = auth.uid())
  );

create policy "profiles: leader read"
  on public.profiles for select to authenticated
  using (public.is_leader_of(cohort_id));

create policy "profiles: self update"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
    and cohort_id is not distinct from (select cohort_id from public.profiles where id = auth.uid())
  );

-- Insert is handled by handle_new_user trigger (security definer), so no insert policy.

-- ---------------------------------------------------------------
-- quest_completions
-- ---------------------------------------------------------------
alter table public.quest_completions enable row level security;

create policy "qc: self read"
  on public.quest_completions for select to authenticated
  using (user_id = auth.uid());

create policy "qc: leader read"
  on public.quest_completions for select to authenticated
  using (public.is_leader_of((select cohort_id from public.profiles where id = user_id)));

-- No direct insert/update/delete — clients must go through complete_quest().

-- ---------------------------------------------------------------
-- journal_entries (PRIVATE — no leader access ever)
-- ---------------------------------------------------------------
alter table public.journal_entries enable row level security;

create policy "je: self read"
  on public.journal_entries for select to authenticated
  using (user_id = auth.uid());

create policy "je: self insert"
  on public.journal_entries for insert to authenticated
  with check (user_id = auth.uid());

create policy "je: self update"
  on public.journal_entries for update to authenticated
  using (user_id = auth.uid());

create policy "je: self delete"
  on public.journal_entries for delete to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------
-- xp_events
-- ---------------------------------------------------------------
alter table public.xp_events enable row level security;

create policy "xp: self read"
  on public.xp_events for select to authenticated
  using (user_id = auth.uid());

-- No client inserts; RPCs write these.

-- ---------------------------------------------------------------
-- badges catalog (public read)
-- ---------------------------------------------------------------
alter table public.badges enable row level security;

create policy "badges: public read"
  on public.badges for select to authenticated, anon
  using (true);

-- ---------------------------------------------------------------
-- user_badges
-- ---------------------------------------------------------------
alter table public.user_badges enable row level security;

create policy "ub: self read"
  on public.user_badges for select to authenticated
  using (user_id = auth.uid());

create policy "ub: leader read"
  on public.user_badges for select to authenticated
  using (public.is_leader_of((select cohort_id from public.profiles where id = user_id)));

-- ---------------------------------------------------------------
-- community_posts
-- ---------------------------------------------------------------
alter table public.community_posts enable row level security;

create policy "cp: cohort read"
  on public.community_posts for select to authenticated
  using (
    is_hidden = false
    and cohort_id = (select cohort_id from public.profiles where id = auth.uid())
  );

create policy "cp: leader read"
  on public.community_posts for select to authenticated
  using (public.is_leader_of(cohort_id));

create policy "cp: self insert"
  on public.community_posts for insert to authenticated
  with check (
    author_id = auth.uid()
    and cohort_id = (select cohort_id from public.profiles where id = auth.uid())
  );

create policy "cp: self update"
  on public.community_posts for update to authenticated
  using (author_id = auth.uid() and created_at > now() - interval '5 minutes');

create policy "cp: leader update"
  on public.community_posts for update to authenticated
  using (public.is_leader_of(cohort_id));

create policy "cp: self delete"
  on public.community_posts for delete to authenticated
  using (author_id = auth.uid());

-- ---------------------------------------------------------------
-- post_reactions
-- ---------------------------------------------------------------
alter table public.post_reactions enable row level security;

create policy "pr: cohort read"
  on public.post_reactions for select to authenticated
  using (
    exists (
      select 1 from public.community_posts p
      where p.id = post_id
        and p.cohort_id = (select cohort_id from public.profiles where id = auth.uid())
        and (p.is_hidden = false or public.is_leader_of(p.cohort_id))
    )
  );

create policy "pr: self insert"
  on public.post_reactions for insert to authenticated
  with check (user_id = auth.uid());

create policy "pr: self delete"
  on public.post_reactions for delete to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------
-- post_reports
-- ---------------------------------------------------------------
alter table public.post_reports enable row level security;

create policy "rep: self insert"
  on public.post_reports for insert to authenticated
  with check (reporter_id = auth.uid());

create policy "rep: leader read"
  on public.post_reports for select to authenticated
  using (public.is_leader_of(
    (select cohort_id from public.community_posts where id = post_id)
  ));

create policy "rep: leader resolve"
  on public.post_reports for update to authenticated
  using (public.is_leader_of(
    (select cohort_id from public.community_posts where id = post_id)
  ));

-- ---------------------------------------------------------------
-- push_subscriptions
-- ---------------------------------------------------------------
alter table public.push_subscriptions enable row level security;

create policy "ps: self read"
  on public.push_subscriptions for select to authenticated
  using (user_id = auth.uid());

create policy "ps: self insert"
  on public.push_subscriptions for insert to authenticated
  with check (user_id = auth.uid());

create policy "ps: self delete"
  on public.push_subscriptions for delete to authenticated
  using (user_id = auth.uid());
