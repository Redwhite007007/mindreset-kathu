# MindReset Kathu — Supabase Schema (Gate 2 deliverable, part 2 of 2)

> Pair doc: `docs/architecture.md` (folder tree, routes, offline, gamification).
> DDL below is a **design sketch**, not a committed migration. Real migration files land in `supabase/migrations/` at Gate 3 after you approve.

## Principles

1. **Content is code, not rows.** Weeks, daily quests, Scripture, discussion questions live in `src/content/weeks/*.ts` — hard-coded and type-checked. Postgres only stores *user progress* against those quests, keyed by `(week_number, day_number)`. This means:
   - No migration needed when we tweak a verse or challenge — just ship a redeploy.
   - Supabase doesn't become an accidental CMS.
   - Offline clients have the full content in their JS bundle already.
2. **RLS everywhere, no exceptions.** Every table has RLS enabled. The `service_role` key is used *only* by the Edge Function for push sending. The app uses `anon`+`authenticated` keys only.
3. **Private data is private, always.** Journal entries are never visible to leaders, admins, or other youth — **only** to the author. No exception.
4. **Cohort scoping.** Every youth belongs to one `cohort`. Community posts and leader dashboards are scoped by `cohort_id`. A leader can only see their own cohort's data.
5. **Idempotent offline sync.** Journal entries and quest completions use client-generated unique IDs so duplicate uploads from a flaky connection are swallowed silently.

## Tables

### `cohorts`
Groups of youth under one leader. Default cohort for v1: `CRC Kathu Youth 2026`.

```sql
create table public.cohorts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  invite_code text unique not null default substr(md5(random()::text), 1, 8),
  created_at  timestamptz not null default now()
);
```

### `profiles`
Extends `auth.users` 1:1. Holds display name, role, cohort, denormalised XP + streak for fast dashboard reads.

```sql
create type user_role as enum ('youth', 'leader', 'admin');

create table public.profiles (
  id                        uuid primary key references auth.users(id) on delete cascade,
  display_name              text not null,                    -- generated or user-chosen, never email
  avatar_emoji              text not null default '🔥',
  role                      user_role not null default 'youth',
  cohort_id                 uuid references public.cohorts(id) on delete set null,
  total_xp                  integer not null default 0 check (total_xp >= 0),
  current_streak            integer not null default 0 check (current_streak >= 0),
  longest_streak            integer not null default 0 check (longest_streak >= 0),
  last_quest_completed_on   date,                             -- SAST-local date, drives streak logic
  morning_push_enabled      boolean not null default true,
  evening_push_enabled      boolean not null default false,
  onboarding_complete_at    timestamptz,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

create index on public.profiles(cohort_id);
```

**Trigger:** `on insert to auth.users → insert profile` via `public.handle_new_user()` function. Generates a random handle like `Kathu Lion 3421` if none supplied.

### `quest_completions`
One row per (user, week, day). Unique to prevent double-awarding XP.

```sql
create table public.quest_completions (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  week_number       smallint not null check (week_number between 1 and 7),
  day_number        smallint not null check (day_number between 1 and 7),
  completed_at      timestamptz not null default now(),
  completed_on      date not null default (now() at time zone 'Africa/Johannesburg')::date,
  duration_seconds  integer check (duration_seconds is null or duration_seconds >= 0),
  client_id         text,      -- UUID generated client-side for offline idempotency
  unique (user_id, week_number, day_number)
);

create unique index if not exists quest_completions_client_idx
  on public.quest_completions(user_id, client_id) where client_id is not null;
create index on public.quest_completions(user_id, completed_on);
```

### `journal_entries`
Text + optional voice / photo references to Storage.

```sql
create table public.journal_entries (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  week_number      smallint check (week_number is null or week_number between 1 and 7),
  day_number       smallint check (day_number is null or day_number between 1 and 7),
  body             text not null default '' check (length(body) <= 10000),
  voice_note_path  text,       -- storage path in 'journal-media' bucket
  voice_duration_s integer,
  photo_path       text,       -- storage path in 'journal-media' bucket
  mood_emoji       text,       -- optional self-reported mood
  client_id        text,       -- offline dedupe key
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index on public.journal_entries(user_id, created_at desc);
create unique index if not exists journal_entries_client_idx
  on public.journal_entries(user_id, client_id) where client_id is not null;
```

### `xp_events`
Audit log. Denormalised `profiles.total_xp` is rebuilt from the sum of events if ever needed.

```sql
create type xp_reason as enum (
  'quest_complete', 'journal_entry', 'voice_journal_bonus',
  'community_reaction', 'community_first_post',
  'week_complete_bonus', 'streak_bonus', 'series_complete_bonus', 'badge_awarded'
);

create table public.xp_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  amount     integer not null check (amount > 0),
  reason     xp_reason not null,
  ref_type   text,       -- 'quest' | 'journal' | 'post' | 'badge' | 'week'
  ref_id     text,       -- composite or uuid, stored as text
  created_at timestamptz not null default now()
);

create index on public.xp_events(user_id, created_at desc);
```

### `badges` + `user_badges`
Catalog + award ledger. Catalog is seeded at migration time (matches `src/content/badges.ts` exactly).

```sql
create table public.badges (
  id          text primary key,        -- slug
  name        text not null,
  description text not null,
  emoji       text not null,
  xp_reward   integer not null default 0,
  sort_order  integer not null default 0
);

create table public.user_badges (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  badge_id   text not null references public.badges(id) on delete cascade,
  earned_at  timestamptz not null default now(),
  primary key (user_id, badge_id)
);
```

Badge *rules* live in `src/lib/gamification/badges.ts`. Awarding runs in a **database function** `public.award_badges_for_user(uuid)` called at the end of the quest-complete RPC, so clients can't forge badge awards.

### `community_posts`
Cohort-scoped, anonymised by default (the client just renders `display_name` which is already an anon handle).

```sql
create table public.community_posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles(id) on delete cascade,
  cohort_id     uuid not null references public.cohorts(id) on delete cascade,
  body          text not null check (length(body) between 1 and 1000),
  week_number   smallint check (week_number is null or week_number between 1 and 7),
  is_hidden     boolean not null default false,  -- leader moderation
  hidden_reason text,
  created_at    timestamptz not null default now()
);

create index on public.community_posts(cohort_id, created_at desc);
create index on public.community_posts(author_id, created_at desc);
```

### `post_reactions`
One row per (user, post, reaction). Four reaction types from youth-group vibes.

```sql
create type reaction_type as enum ('flame', 'pray', 'amen', 'same');

create table public.post_reactions (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.community_posts(id) on delete cascade,
  reaction   reaction_type not null,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id, reaction)
);

create index on public.post_reactions(post_id);
```

### `post_reports`
Any youth can flag a post for a leader to review.

```sql
create table public.post_reports (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.community_posts(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason      text,
  resolved    boolean not null default false,
  resolved_by uuid references public.profiles(id),
  resolved_at timestamptz,
  created_at  timestamptz not null default now()
);

create index on public.post_reports(post_id);
create index on public.post_reports(resolved, created_at);
```

### `push_subscriptions`
Web Push subscription bag.

```sql
create table public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  endpoint    text not null,
  p256dh      text not null,
  auth        text not null,
  user_agent  text,
  created_at  timestamptz not null default now(),
  unique (user_id, endpoint)
);
```

## Storage buckets

| Bucket | Public? | Purpose | RLS |
|---|---|---|---|
| `journal-media` | ❌ private | Voice notes + photos attached to journal entries | Owner-only read/write |

Policies use the pattern `(storage.foldername(name))[1] = auth.uid()::text`, so files must be uploaded under `/<user-uuid>/<uuid>.webm` or `/<user-uuid>/<uuid>.jpg`.

## Helper SQL functions

```sql
-- Checks whether the calling user is a leader for the given cohort
create or replace function public.is_leader_of(c uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.cohort_id = c
      and p.role in ('leader','admin')
  );
$$;

-- Record a quest completion + award XP + possibly award badges.
-- Called via supabase.rpc('complete_quest', { ... }).
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
  v_user_id     uuid := auth.uid();
  v_awarded_xp  integer := 25;
  v_streak      integer;
  v_today       date := (now() at time zone 'Africa/Johannesburg')::date;
  v_last        date;
  v_new_badges  text[];
begin
  if v_user_id is null then raise exception 'not authenticated'; end if;

  -- Insert completion (idempotent via unique constraint)
  insert into public.quest_completions (user_id, week_number, day_number, duration_seconds, client_id)
  values (v_user_id, p_week, p_day, p_duration, p_client_id)
  on conflict (user_id, week_number, day_number) do nothing;

  -- Streak logic
  select last_quest_completed_on, current_streak into v_last, v_streak
  from public.profiles where id = v_user_id for update;

  if v_last is null or v_last < v_today - 1 then
    v_streak := 1;
  elsif v_last = v_today - 1 then
    v_streak := v_streak + 1;
  end if;
  -- if v_last = v_today then streak unchanged (multiple completions same day)

  update public.profiles
     set total_xp = total_xp + v_awarded_xp,
         current_streak = v_streak,
         longest_streak = greatest(longest_streak, v_streak),
         last_quest_completed_on = v_today,
         updated_at = now()
   where id = v_user_id;

  insert into public.xp_events (user_id, amount, reason, ref_type, ref_id)
  values (v_user_id, v_awarded_xp, 'quest_complete', 'quest', p_week||':'||p_day);

  -- Evaluate badges (function defined separately)
  v_new_badges := public.award_badges_for_user(v_user_id);

  return json_build_object(
    'xp_awarded', v_awarded_xp,
    'current_streak', v_streak,
    'new_badges', v_new_badges
  );
end;
$$;

-- updated_at trigger function
create or replace function public.tg_set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end; $$;
```

Triggers wire `tg_set_updated_at` to `profiles` and `journal_entries`.

## Row-Level Security

All tables enable RLS. Below are the policies per table.

### `profiles`
```sql
alter table public.profiles enable row level security;

-- read own
create policy "profiles: self read" on public.profiles
  for select using (id = auth.uid());

-- read cohort-mates (for community display names); does NOT expose private fields
-- (those are already minimal; if that bothers us, we can create a view)
create policy "profiles: cohort read" on public.profiles
  for select using (
    cohort_id is not null and
    cohort_id = (select cohort_id from public.profiles where id = auth.uid())
  );

-- leaders read their cohort
create policy "profiles: leader read" on public.profiles
  for select using (public.is_leader_of(cohort_id));

-- update own, but cannot change role or cohort
create policy "profiles: self update" on public.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
    and cohort_id is not distinct from (select cohort_id from public.profiles where id = auth.uid())
  );
```
Insert is handled by the `handle_new_user` trigger (security definer), so no insert policy exists for clients.

### `quest_completions`
```sql
alter table public.quest_completions enable row level security;

create policy "qc: self read"   on public.quest_completions for select using (user_id = auth.uid());
create policy "qc: leader read" on public.quest_completions for select using (
  public.is_leader_of((select cohort_id from public.profiles where id = user_id))
);
-- No direct insert policy: inserts must go through complete_quest() RPC (security definer).
```

### `journal_entries`
```sql
alter table public.journal_entries enable row level security;

create policy "je: self read"   on public.journal_entries for select using (user_id = auth.uid());
create policy "je: self insert" on public.journal_entries for insert with check (user_id = auth.uid());
create policy "je: self update" on public.journal_entries for update using (user_id = auth.uid());
create policy "je: self delete" on public.journal_entries for delete using (user_id = auth.uid());
-- NO leader policy. Journals are private. Period.
```

### `xp_events`
```sql
alter table public.xp_events enable row level security;

create policy "xp: self read" on public.xp_events for select using (user_id = auth.uid());
-- No client insert; RPCs write these.
```

### `badges`
```sql
alter table public.badges enable row level security;
create policy "badges: public read" on public.badges for select using (true);
-- No client writes.
```

### `user_badges`
```sql
alter table public.user_badges enable row level security;

create policy "ub: self read"   on public.user_badges for select using (user_id = auth.uid());
create policy "ub: leader read" on public.user_badges for select using (
  public.is_leader_of((select cohort_id from public.profiles where id = user_id))
);
-- No client inserts. Awarded only by complete_quest() → award_badges_for_user().
```

### `community_posts`
```sql
alter table public.community_posts enable row level security;

-- Youth can read their cohort's non-hidden posts
create policy "cp: cohort read" on public.community_posts for select using (
  is_hidden = false
  and cohort_id = (select cohort_id from public.profiles where id = auth.uid())
);

-- Leaders can read all posts in their cohort (including hidden)
create policy "cp: leader read" on public.community_posts for select using (
  public.is_leader_of(cohort_id)
);

-- Insert: author_id must equal the user, cohort_id must match the user's cohort
create policy "cp: self insert" on public.community_posts for insert with check (
  author_id = auth.uid()
  and cohort_id = (select cohort_id from public.profiles where id = auth.uid())
);

-- Update: author can edit their own within 5 minutes; leader can hide
create policy "cp: self update" on public.community_posts for update using (
  author_id = auth.uid() and created_at > now() - interval '5 minutes'
);
create policy "cp: leader update" on public.community_posts for update using (
  public.is_leader_of(cohort_id)
);

-- Delete: author can delete their own
create policy "cp: self delete" on public.community_posts for delete using (author_id = auth.uid());
```

### `post_reactions`
```sql
alter table public.post_reactions enable row level security;

create policy "pr: cohort read" on public.post_reactions for select using (
  exists (
    select 1 from public.community_posts p
    where p.id = post_id
      and p.cohort_id = (select cohort_id from public.profiles where id = auth.uid())
      and (p.is_hidden = false or public.is_leader_of(p.cohort_id))
  )
);
create policy "pr: self insert" on public.post_reactions for insert with check (user_id = auth.uid());
create policy "pr: self delete" on public.post_reactions for delete using (user_id = auth.uid());
```

### `post_reports`
```sql
alter table public.post_reports enable row level security;

create policy "rep: self insert" on public.post_reports for insert with check (reporter_id = auth.uid());
create policy "rep: leader read" on public.post_reports for select using (
  public.is_leader_of((select cohort_id from public.community_posts where id = post_id))
);
create policy "rep: leader resolve" on public.post_reports for update using (
  public.is_leader_of((select cohort_id from public.community_posts where id = post_id))
);
```

### `push_subscriptions`
```sql
alter table public.push_subscriptions enable row level security;

create policy "ps: self read"   on public.push_subscriptions for select using (user_id = auth.uid());
create policy "ps: self insert" on public.push_subscriptions for insert with check (user_id = auth.uid());
create policy "ps: self delete" on public.push_subscriptions for delete using (user_id = auth.uid());
```

### Storage policies — `journal-media` bucket
```sql
-- Upload: owner folder only
create policy "jm: self upload" on storage.objects for insert
  with check (
    bucket_id = 'journal-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Read: owner only
create policy "jm: self read" on storage.objects for select
  using (
    bucket_id = 'journal-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Delete: owner only
create policy "jm: self delete" on storage.objects for delete
  using (
    bucket_id = 'journal-media'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

## Realtime

Enable realtime on `community_posts` and `post_reactions` only. Everything else is fetched via normal queries.

```sql
alter publication supabase_realtime add table public.community_posts;
alter publication supabase_realtime add table public.post_reactions;
```

## Migration file layout (Gate 3 will produce these)

```
supabase/migrations/
├── 0001_init.sql              # extensions, enums, tables, indexes
├── 0002_triggers_and_rpcs.sql # handle_new_user, complete_quest, award_badges_for_user, updated_at triggers
├── 0003_rls.sql               # all RLS policies
├── 0004_badges_seed.sql       # badge catalog matching src/content/badges.ts
├── 0005_storage.sql           # bucket creation + storage policies
└── 0006_realtime.sql          # publication additions
```

`supabase/seed.ts` creates: one default cohort (`CRC Kathu Youth 2026`), one sample leader account if `NEXT_SEED_LEADER_EMAIL` is set, and links badges 1:1 with the catalog.

## Supabase → TypeScript types

After migrations apply locally, we regenerate types with:
```bash
npx supabase gen types typescript --local > src/lib/supabase/types.ts
```
This file is tracked in git so deploy environments don't need the Supabase CLI.

## Security review checklist (I'll run this at Gate 6)

- [ ] RLS enabled on every public table
- [ ] No policy uses `auth.role() = 'service_role'` inside app-facing tables
- [ ] `service_role` key is only in Supabase Function env, never in the Next app env
- [ ] `complete_quest` is `security definer` and has `set search_path = public`
- [ ] Storage policies use `storage.foldername(name)[1] = auth.uid()::text`
- [ ] Journal entries have **no** leader policy
- [ ] Push subscriptions have no shared-read
- [ ] Community posts cannot be inserted with a different `author_id` than `auth.uid()`
- [ ] Post edit window enforced (5 minutes) and verified in policy + RPC
- [ ] No table allows anon inserts

## Open decisions for Gate 3

1. **Realtime scope.** Do we want typing indicators or reaction counts to live-update? I propose reactions live, posts live — nothing else. Keeps the CPU + bandwidth modest.
2. **Moderation strategy.** v1 is "leader manually hides". We could add a profanity filter as a database trigger, but I'd skip it for v1 — the cohort is small and trust-based.
3. **Denormalised vs. view for dashboard reads.** `profiles.total_xp` + `current_streak` are denormalised. Alternative is a materialised view. I'm sticking with denormalised columns updated inside `complete_quest()` — simpler, consistent, avoids MV refresh complexity.

## Next step
Gate 2 complete. Two docs pending review:
- `docs/architecture.md` — folder tree, routes, content model, theme, offline, gamification
- `docs/supabase-schema.md` — THIS FILE

Awaiting approval to proceed to **Gate 3 — Scaffold + Week 1 MVP** (first code, first runnable app).
