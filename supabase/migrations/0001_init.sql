-- MindReset Kathu — initial schema
-- Tables, enums, indexes. No policies or RPCs in this file.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------
create type public.user_role as enum ('youth', 'leader', 'admin');

create type public.xp_reason as enum (
  'quest_complete',
  'journal_entry',
  'voice_journal_bonus',
  'community_reaction',
  'community_first_post',
  'week_complete_bonus',
  'streak_bonus',
  'series_complete_bonus',
  'badge_awarded'
);

create type public.reaction_type as enum ('flame', 'pray', 'amen', 'same');

-- ---------------------------------------------------------------
-- Cohorts
-- ---------------------------------------------------------------
create table public.cohorts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  invite_code text unique not null default substr(md5(random()::text), 1, 8),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Profiles (extends auth.users 1:1)
-- ---------------------------------------------------------------
create table public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  display_name            text not null,
  avatar_emoji            text not null default '🔥',
  role                    public.user_role not null default 'youth',
  cohort_id               uuid references public.cohorts(id) on delete set null,
  total_xp                integer not null default 0 check (total_xp >= 0),
  current_streak          integer not null default 0 check (current_streak >= 0),
  longest_streak          integer not null default 0 check (longest_streak >= 0),
  last_quest_completed_on date,
  morning_push_enabled    boolean not null default true,
  evening_push_enabled    boolean not null default false,
  onboarding_complete_at  timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);
create index profiles_cohort_idx on public.profiles(cohort_id);

-- ---------------------------------------------------------------
-- Quest completions
-- ---------------------------------------------------------------
create table public.quest_completions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  week_number      smallint not null check (week_number between 1 and 7),
  day_number       smallint not null check (day_number between 1 and 7),
  completed_at     timestamptz not null default now(),
  completed_on     date not null default (now() at time zone 'Africa/Johannesburg')::date,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  client_id        text,
  unique (user_id, week_number, day_number)
);
create unique index quest_completions_client_idx
  on public.quest_completions(user_id, client_id) where client_id is not null;
create index quest_completions_user_date_idx
  on public.quest_completions(user_id, completed_on);

-- ---------------------------------------------------------------
-- Journal entries
-- ---------------------------------------------------------------
create table public.journal_entries (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  week_number       smallint check (week_number is null or week_number between 1 and 7),
  day_number        smallint check (day_number is null or day_number between 1 and 7),
  body              text not null default '' check (length(body) <= 10000),
  voice_note_path   text,
  voice_duration_s  integer,
  photo_path        text,
  mood_emoji        text,
  client_id         text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index journal_user_created_idx
  on public.journal_entries(user_id, created_at desc);
create unique index journal_client_idx
  on public.journal_entries(user_id, client_id) where client_id is not null;

-- ---------------------------------------------------------------
-- XP audit log
-- ---------------------------------------------------------------
create table public.xp_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  amount     integer not null check (amount > 0),
  reason     public.xp_reason not null,
  ref_type   text,
  ref_id     text,
  created_at timestamptz not null default now()
);
create index xp_user_created_idx on public.xp_events(user_id, created_at desc);

-- ---------------------------------------------------------------
-- Badges catalog + user awards
-- ---------------------------------------------------------------
create table public.badges (
  id          text primary key,
  name        text not null,
  description text not null,
  emoji       text not null,
  xp_reward   integer not null default 0,
  sort_order  integer not null default 0
);

create table public.user_badges (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  badge_id  text not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

-- ---------------------------------------------------------------
-- Community
-- ---------------------------------------------------------------
create table public.community_posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles(id) on delete cascade,
  cohort_id     uuid not null references public.cohorts(id) on delete cascade,
  body          text not null check (length(body) between 1 and 1000),
  week_number   smallint check (week_number is null or week_number between 1 and 7),
  is_hidden     boolean not null default false,
  hidden_reason text,
  created_at    timestamptz not null default now()
);
create index community_cohort_created_idx
  on public.community_posts(cohort_id, created_at desc);
create index community_author_idx
  on public.community_posts(author_id, created_at desc);

create table public.post_reactions (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  post_id    uuid not null references public.community_posts(id) on delete cascade,
  reaction   public.reaction_type not null,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id, reaction)
);
create index post_reactions_post_idx on public.post_reactions(post_id);

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
create index post_reports_post_idx on public.post_reports(post_id);
create index post_reports_resolved_idx on public.post_reports(resolved, created_at);

-- ---------------------------------------------------------------
-- Push subscriptions
-- ---------------------------------------------------------------
create table public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  endpoint   text not null,
  p256dh     text not null,
  auth       text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  unique (user_id, endpoint)
);
