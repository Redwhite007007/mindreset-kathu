# MindReset Kathu

A 7-week brain-and-faith reboot Progressive Web App for **CRC Kathu** youth
(Kathu, Northern Cape, South Africa). Neuroscience meets Scripture meets
small, daily practice — shipped as an installable, offline-capable PWA.

> **Status:** Gate 3 — Scaffold + Week 1 MVP. Everything the young person
> sees on the dashboard, the 7-week selector, each daily quest, the private
> local journal, and the profile + support pages is wired up. The app runs
> fully **local-only** without Supabase. Auth, community feed, leader
> dashboard, voice/photo journal, sync, and push notifications ship in
> Gates 4–5. See `docs/architecture.md` for the plan.

---

## Quick start (local-only, no Supabase)

```bash
npm install
npm run dev
# http://localhost:3000
```

That's it. The app stores progress in `localStorage` under the key
`mindreset-kathu/v1` and works offline-first. No database required for the
core 7-week experience.

## Running with Supabase (full stack)

1. **Install the Supabase CLI** (<https://supabase.com/docs/guides/cli>).

2. **Start a local Supabase stack** (Postgres + Auth + Storage):

   ```bash
   supabase start
   ```

   Note the output values — `API URL`, `anon key`, `service_role key`.

3. **Copy the env template** and paste the values in:

   ```bash
   cp .env.example .env.local
   ```

   Fill in at minimum:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-side only; for seed + admin scripts)

4. **Apply migrations + seed badges + default cohort:**

   ```bash
   npm run db:reset        # drops and re-applies all migrations
   npx tsx supabase/seed.ts # creates a dev leader account (optional)
   ```

5. **Generate TypeScript types** (optional but recommended):

   ```bash
   npm run db:types
   ```

6. **Run the dev server:**

   ```bash
   npm run dev
   ```

## Deploying to production (Vercel + hosted Supabase)

1. Create a Supabase project at <https://supabase.com/dashboard>.
2. In the Supabase SQL editor or via `supabase db push`, apply
   `supabase/migrations/*.sql` in order (0001 → 0006), then run
   `supabase/migrations/0004_badges_seed.sql` to insert the badge catalogue
   and default cohort.
3. Push this repo to GitHub and import it in Vercel.
4. Configure Vercel environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY`
     (generate with `npx web-push generate-vapid-keys`)
   - `NEXT_PUBLIC_DEFAULT_COHORT_SLUG=crc-kathu-youth-2026`
5. In Supabase **Authentication → URL Configuration**, add your production
   URL to the allowed redirect list (`https://your-domain/callback`).
6. Deploy. The PWA installability prompt will appear on supported browsers.

## Tech stack

- **Next.js 15** (App Router, React 19 RC, Server Components + Server Actions)
- **TypeScript** (strict)
- **Tailwind CSS v4** with CSS-driven theme tokens
- **Supabase** (Postgres + Auth + Storage + Realtime)
- **localStorage** offline-first store with idempotent sync (client_id UUIDs)
- **canvas-confetti** + **motion** for celebration animations
- **lucide-react** icons
- PWA via `app/manifest.ts` + service worker (Gate 5)

## Folder map

```
docs/                          Research + architecture + schema + inventory
public/                        PWA icons + sw.js stub
scripts/                       Helper scripts (icon generator, etc.)
src/
  app/
    (app)/                     The signed-in experience (dashboard, week, quest, journal, profile, support)
    (auth)/                    Magic-link sign-in flow
    api/health/                Health check endpoint
    globals.css                Tailwind v4 @theme with brand tokens
    layout.tsx                 Root layout with PWA meta
    manifest.ts                Next metadata-route manifest
  components/
    ui/                        Primitive building blocks (Button, Card, Progress, Alert)
    nav/                       TopBar + BottomNav
    dashboard/                 BrainRebootMeter, TodayQuestCard, StreakFlame, WeekProgressRow
    week/                      WeekHero, WeekDayList, WeekDiscussion
    quest/                     QuestRunner, QuestTimer, QuestScriptureCard, QuestNeuroscienceCard, QuestCompleteSheet
    journal/                   JournalEditor, JournalList
    gamification/              BadgeGrid, LevelBadge
    profile/                   ProfileView
    auth/                      SignInForm
  content/
    weeks/                     The 7 weeks — all copy verbatim from the PDF
    appendices/                Support helplines + Afrikaans glossary
    badges.ts                  14-badge catalogue (mirrors SQL seed)
    push-messages.ts           Kathu-contextual nudges
  hooks/                       useLocalState, useQuestTimer, useConfetti
  lib/
    gamification/              XP math, levels, streak flames
    quests/                    Unlock rules, today-picker
    offline/                   local-store (the heart of auth-optional design)
    supabase/                  Null-safe client/server factories
    auth/                      getCurrentUser (null-safe)
    utils/                     cn, date (SAST-aware), haptics, anon handles
  middleware.ts                Refreshes Supabase session cookies
supabase/
  migrations/                  0001-init → 0006-realtime
  seed.ts                      Dev leader account seeder
```

## What the user sees

- **Dashboard** — Brain Reboot Meter (level + XP progress + series %),
  Today's Quest card, Reboot Flame streak tile, 7-week progress grid with
  lock indicators.
- **Week detail** — hero with week title, subtitle, pull quote, cultural
  note, 7-day quest list (ticked as completed), Reset Challenge, Scripture
  anchors, practices, and discussion questions.
- **Daily quest** — header, instructions, countdown timer (where the
  quest is timed), "Why this works" neuroscience card, Scripture card,
  and a big "Mark complete" button. Confetti on completion.
- **Private journal** — mood selector, free-text body, save-privately
  note. Stored on device only. No leader read policy.
- **Profile** — handle (editable), level badge, XP, streak stats,
  push-reminder toggles, badge grid, reset/sign-out buttons.
- **Support** — SA helplines (verbatim from PDF Appendix B) with tel and
  sms links, Afrikaans glossary (Appendix C).

## Design system

Brand tokens live in `src/app/globals.css` under `@theme`. The palette is:

| Token                        | Value     | Used for                           |
| ---------------------------- | --------- | ---------------------------------- |
| `--color-reboot-bg`          | `#0B1020` | Page background                    |
| `--color-reboot-surface`     | `#141B33` | Cards                              |
| `--color-reboot-surface-2`   | `#1C2445` | Elevated surfaces                  |
| `--color-reboot-text`        | `#F5F7FF` | Body text                          |
| `--color-reboot-muted`       | `#94A2C2` | Secondary text                     |
| `--color-reboot-electric`    | `#3B82F6` | Primary actions, scripture         |
| `--color-reboot-neon`        | `#22D3A8` | Progress, completed state          |
| `--color-reboot-sunset`      | `#F97316` | Badges, highlights                 |
| `--color-reboot-flame`       | `#FB7185` | Streak flame                       |
| `--color-reboot-violet`      | `#A78BFA` | Accent                             |
| `--color-reboot-warning`     | `#F59E0B` | Contextual alerts                  |
| `--color-reboot-danger`      | `#EF4444` | Destructive + crisis alerts        |

Dark mode is default (and the only mode) for now. `prefers-reduced-motion`
is respected site-wide via a CSS override in `globals.css`.

## Content source-of-truth

**All** chapter copy — verses, neuroscience hooks, pull quotes, practices,
discussion questions, daily quests, cultural notes, contextual alerts —
lives in `src/content/weeks/week-{1..7}.ts`. Each file is type-checked
against `src/content/types.ts` and the authoritative inventory at
`docs/content-inventory.md`. That inventory maps 1:1 to the chapters in
`Mind Reset Series Revised.pdf` (see `docs/_pdf-raw.txt` for the raw
extraction). If you change wording, update both the TS module and the
inventory — they are the source-of-truth pair.

## Gamification rules

- **XP per quest:** 25 (+ bonuses: 100 for a week, 50 for a 7-day streak,
  300 for completing the series).
- **Level:** `floor(sqrt(xp / 50))`, capped at 15.
- **Reboot Flame tiers:** Spark (1 day), Steady (3), Blaze (7), Inferno (14).
- **Streak rollover:** midnight **SAST** (Africa/Johannesburg), not device
  midnight. Implementation in `src/lib/utils/date.ts` and
  `src/lib/gamification/streak.ts`.
- **Week unlock:** the next week unlocks when the user has ≥6/7 quests
  done in the previous week **or** 7 calendar days have passed since the
  previous week was unlocked (grace path — nobody gets gatekept by a
  missed day).

## Offline-first

Every progress mutation (`completeQuestLocal`, `addJournalLocal`,
`updateProfileLocal`) writes synchronously to `localStorage` under
`mindreset-kathu/v1` and fires a `mindreset:state-changed` custom event
that `useLocalState` listens for via `useSyncExternalStore`. No network
required. When Supabase is configured **and** the user is signed in, a
Gate 5 sync layer will replay the local state via the `complete_quest`
RPC (which is idempotent on `client_id`).

## Privacy

- The **journal is device-local**. Even when Supabase is configured,
  `journal_entries` has RLS policies that allow **only the user** to
  read — no leader or pastor override. That is deliberate and not up for
  negotiation. If a user asks their leader to read their journal, the
  leader opens the user's phone and reads it with them. The database
  does not give leaders that route.
- **Community posts** are anonymised behind Kathu-flavoured handles
  (`Kathu Lion 4291` etc.) and cohort-scoped. Personal emails + profile
  rows live in `profiles`, never denormalised to posts.
- **Push notifications** are opt-in per reminder slot (morning / evening).
  They are local nudges, never shaming, never from a named pastor. Copy
  is in `src/content/push-messages.ts`.

## Gaps / known TODOs

- **Icons** under `public/icons/*` are gradient placeholders generated
  by `scripts/gen-icons.mjs`. Replace with real brand art before launch.
- Voice journal + photo upload land in Gate 5.
- Community feed + leader dashboard + moderation land in Gate 4.
- Service worker at `public/sw.js` is a no-op stub; Gate 5 wires up
  Workbox runtime caching + background sync.
- Afrikaans translations are Appendix-C-only for now; full chapter
  translations per the PDF's "on request" note.

## Commands

| Command             | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Start the Next dev server                       |
| `npm run build`     | Production build                                |
| `npm run start`     | Serve the production build                      |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | `tsc --noEmit`                                  |
| `npm run check`     | Lint + typecheck                                |
| `npm run db:reset`  | Drop + re-apply all Supabase migrations         |
| `npm run db:push`   | Push migrations to the remote Supabase project  |
| `npm run db:types`  | Regenerate `src/lib/supabase/types.ts`          |
| `node scripts/gen-icons.mjs` | Regenerate placeholder PWA icons       |

## License

Copyright © 2026 CRC Kathu. All content from *Mind Reset Series
(Revised)* is used with permission for the church's youth programme.
