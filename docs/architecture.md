# MindReset Kathu — Architecture (Gate 2 deliverable, part 1 of 2)

> Pair doc: `docs/supabase-schema.md` (DB design, RLS, policies).
> No app code exists yet — this is the shape I propose before scaffolding.

## Stack (locked by user spec)

| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 15**, App Router, RSC | User-specified; RSC keeps client bundle lean for mobile |
| Language | **TypeScript (strict)** | Hard-coded content is typed so PDF drift is caught at build |
| Styling | **Tailwind v4** + CSS variables | Theme tokens live in `globals.css`, Tailwind reads via `@theme` |
| Auth / DB | **Supabase** (`@supabase/ssr`) | Magic link + Postgres + RLS + Realtime + Edge Functions + Storage |
| State | Server Components first, `useSyncExternalStore`-backed **IndexedDB** via `idb` for offline | No global store library — simplifies offline sync |
| PWA | `next-pwa` *or* hand-rolled `manifest.ts` + `public/sw.js` | Decision at Gate 3 — see note below |
| Push | Web Push (VAPID) via Supabase Edge Function | `web-push` lib used server-side only |
| Gamification FX | `canvas-confetti` + `framer-motion` | Small, battle-tested; motion respects `prefers-reduced-motion` |
| Voice journal | `MediaRecorder` → `audio/webm` → Supabase Storage | No extra deps |
| Image journal | `<input type="file" accept="image/*" capture="environment">` + Storage | Native camera on mobile |
| Icons | `lucide-react` | Tree-shakable |

**PWA library decision:** `next-pwa` lags Next 15 support. Proposal is a **hand-rolled service worker** registered from `app/layout.tsx`, with Workbox-style runtime caching written by hand (it's ~80 lines). I'll flag this at Gate 3 when I have the code in front of you. If `@serwist/next` has stable Next 15 support by then, I'll use that instead and note the swap.

## Folder tree (proposed)

```
mindreset-kathu/
├── .env.example
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts        # v4 shim for editor support; real theme in globals.css
├── tsconfig.json
├── README.md                  # Gate 6 deliverable
├── docs/
│   ├── content-inventory.md   # ✅ Gate 1
│   ├── architecture.md        # ← THIS FILE
│   ├── supabase-schema.md     # ← companion (Gate 2 part 2)
│   └── _pdf-raw.txt           # PDF extraction, kept for diffing
├── public/
│   ├── manifest.webmanifest   # emitted from app/manifest.ts at build
│   ├── icons/                 # 192, 256, 384, 512, maskable variants
│   ├── sw.js                  # service worker (hand-rolled)
│   ├── offline.html           # last-resort fallback
│   └── og/
│       └── default.png        # Open Graph share card
├── supabase/
│   ├── config.toml            # local dev
│   ├── migrations/
│   │   ├── 0001_init.sql
│   │   ├── 0002_rls.sql
│   │   ├── 0003_badges_catalog.sql
│   │   └── 0004_storage.sql
│   ├── seed.ts                # badges + a demo cohort (Gate 3)
│   └── functions/
│       └── send-push/
│           ├── index.ts       # Deno Edge Function
│           └── deno.json
├── scripts/
│   ├── generate-pwa-icons.mjs
│   ├── generate-vapid-keys.mjs
│   └── gen-db-types.mjs       # wraps `supabase gen types typescript`
└── src/
    ├── middleware.ts          # Next.js middleware → Supabase session refresh
    ├── app/
    │   ├── layout.tsx                  # root layout, dark by default, PWA meta
    │   ├── page.tsx                    # Dashboard (/)
    │   ├── globals.css                 # @theme tokens + resets
    │   ├── manifest.ts                 # Next 15 metadata → manifest.webmanifest
    │   ├── robots.ts
    │   ├── icon.tsx                    # generated favicon
    │   ├── apple-icon.tsx
    │   ├── (marketing)/                # OPTIONAL: unauthed landing; v1 skips
    │   ├── (auth)/
    │   │   ├── sign-in/page.tsx        # email magic link form
    │   │   ├── check-email/page.tsx
    │   │   └── callback/route.ts       # exchanges magic-link code
    │   ├── (app)/                      # auth-gated layout group
    │   │   ├── layout.tsx              # BottomNav, auth guard
    │   │   ├── week/
    │   │   │   ├── [week]/
    │   │   │   │   ├── page.tsx        # Week overview + day picker
    │   │   │   │   └── quest/
    │   │   │   │       └── [day]/
    │   │   │   │           └── page.tsx
    │   │   ├── journal/
    │   │   │   ├── page.tsx            # list
    │   │   │   └── new/page.tsx        # composer
    │   │   ├── community/
    │   │   │   ├── page.tsx            # anonymised cohort feed
    │   │   │   └── post/[id]/page.tsx
    │   │   ├── profile/
    │   │   │   └── page.tsx            # badges, streak history, Appendix A journey summary
    │   │   └── support/
    │   │       └── page.tsx            # Appendix B resources + Appendix C glossary
    │   ├── leader/
    │   │   ├── layout.tsx              # role === 'leader' guard
    │   │   ├── page.tsx                # cohort dashboard
    │   │   └── moderation/
    │   │       └── page.tsx            # flagged posts
    │   └── api/
    │       ├── push/
    │       │   ├── subscribe/route.ts  # POST save subscription
    │       │   └── vapid-public/route.ts
    │       └── health/route.ts
    ├── components/
    │   ├── ui/                         # primitives
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Dialog.tsx
    │   │   ├── Sheet.tsx
    │   │   ├── Progress.tsx
    │   │   └── Alert.tsx
    │   ├── nav/
    │   │   ├── BottomNav.tsx
    │   │   ├── TopBar.tsx
    │   │   └── BackButton.tsx
    │   ├── dashboard/
    │   │   ├── BrainRebootMeter.tsx    # animated XP ring
    │   │   ├── TodayQuestCard.tsx
    │   │   ├── StreakFlame.tsx
    │   │   └── WeekProgressRow.tsx
    │   ├── quest/
    │   │   ├── QuestHeader.tsx
    │   │   ├── QuestTimer.tsx          # 3-min countdown w/ haptics
    │   │   ├── QuestInstructions.tsx
    │   │   ├── QuestNeuroscienceCard.tsx
    │   │   ├── QuestScriptureCard.tsx
    │   │   └── QuestCompleteSheet.tsx  # confetti + XP + new badge
    │   ├── journal/
    │   │   ├── JournalList.tsx
    │   │   ├── JournalEditor.tsx
    │   │   ├── VoiceRecorder.tsx
    │   │   ├── PhotoUpload.tsx
    │   │   └── OfflineSaveIndicator.tsx
    │   ├── community/
    │   │   ├── PostComposer.tsx
    │   │   ├── PostCard.tsx
    │   │   ├── ReactionBar.tsx
    │   │   └── ReportMenu.tsx
    │   ├── leader/
    │   │   ├── CohortCompletionChart.tsx
    │   │   ├── StreakLeaderboard.tsx
    │   │   └── FlaggedPostRow.tsx
    │   ├── gamification/
    │   │   ├── XPBar.tsx
    │   │   ├── BadgeGrid.tsx
    │   │   ├── LevelBadge.tsx
    │   │   └── Confetti.tsx            # wraps canvas-confetti
    │   ├── pwa/
    │   │   ├── InstallPrompt.tsx       # beforeinstallprompt UI
    │   │   ├── OfflineBanner.tsx
    │   │   └── PushPermissionSheet.tsx
    │   └── support/
    │       └── SafetyAlert.tsx         # Week 4 + Week 6 contextual banners
    ├── content/
    │   ├── types.ts                    # Week, DailyQuest, Verse, Badge types
    │   ├── weeks/
    │   │   ├── index.ts                # exports WEEKS: Week[]
    │   │   ├── week-1.ts               # verbatim from PDF
    │   │   ├── week-2.ts
    │   │   ├── week-3.ts
    │   │   ├── week-4.ts
    │   │   ├── week-5.ts
    │   │   ├── week-6.ts
    │   │   └── week-7.ts
    │   ├── badges.ts                   # badge catalog (matches DB seed)
    │   ├── appendices/
    │   │   ├── tracker.ts              # Appendix A
    │   │   ├── support.ts              # Appendix B
    │   │   └── glossary-af.ts          # Appendix C
    │   └── push-messages.ts            # localised Kathu push copy
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts               # createBrowserClient
    │   │   ├── server.ts               # createServerClient (RSC + Route Handlers)
    │   │   ├── middleware.ts           # updateSession helper
    │   │   └── types.ts                # generated DB types (gitignored-but-tracked)
    │   ├── auth/
    │   │   ├── get-current-user.ts     # RSC helper
    │   │   └── require-role.ts         # server-side role gate
    │   ├── gamification/
    │   │   ├── xp.ts                   # award rules + point values
    │   │   ├── levels.ts               # level = floor(sqrt(xp/50))
    │   │   ├── streak.ts               # streak calc + flame tiers
    │   │   └── badges.ts               # badge award evaluator
    │   ├── offline/
    │   │   ├── db.ts                   # idb wrappers
    │   │   ├── sync.ts                 # outbox flush on 'online'
    │   │   ├── schema.ts               # IndexedDB schema types
    │   │   └── hooks.ts                # useOnline, useOutbox
    │   ├── push/
    │   │   ├── subscribe.ts            # browser subscribe flow
    │   │   └── vapid.ts                # constants only (public key on client)
    │   ├── quests/
    │   │   ├── unlock.ts               # week unlock rules (≥ 80% prev week)
    │   │   └── today.ts                # compute "today's quest"
    │   └── utils/
    │       ├── cn.ts                   # clsx + tailwind-merge
    │       ├── date.ts                 # Africa/Johannesburg aware
    │       ├── haptics.ts              # navigator.vibrate wrapper
    │       └── anon.ts                 # anon display-name generator
    ├── hooks/
    │   ├── useStreak.ts
    │   ├── useXP.ts
    │   ├── useQuestTimer.ts
    │   ├── useConfetti.ts
    │   ├── useOfflineJournal.ts
    │   └── useInstallPrompt.ts
    └── styles/
        └── motion.css                  # reduced-motion overrides
```

## Route map

| Route | Purpose | Auth | Role |
|---|---|---|---|
| `/` | Dashboard: Brain Reboot Meter, today's quest, streak | ✅ | any |
| `/sign-in` | Magic link entry | ❌ | — |
| `/check-email` | "Check your email" confirmation | ❌ | — |
| `/callback` | OAuth/magic-link code exchange (route handler) | ❌ | — |
| `/week/[week]` | Week overview + locked/unlocked day picker | ✅ | any |
| `/week/[week]/quest/[day]` | Daily quest (timer + instructions + Scripture) | ✅ | any |
| `/journal` | Private journal list (offline capable) | ✅ | any |
| `/journal/new` | Composer (text + voice + photo) | ✅ | any |
| `/community` | Cohort feed (anonymised by default) | ✅ | any |
| `/community/post/[id]` | Single post + reactions + report | ✅ | any |
| `/profile` | Badges, streak history, Journey Summary (Appx A) | ✅ | any |
| `/support` | Appendix B helplines + Appendix C glossary | ✅ | any |
| `/leader` | Cohort completion + streak leaderboard | ✅ | `leader`/`admin` |
| `/leader/moderation` | Flagged posts queue | ✅ | `leader`/`admin` |
| `/api/push/subscribe` | POST save push subscription | ✅ | any |
| `/api/push/vapid-public` | GET public VAPID key | ✅ | any |

Middleware (`src/middleware.ts`) runs on every non-asset request, refreshes the Supabase session cookie, and redirects unauthenticated users to `/sign-in` for anything inside `(app)` or `/leader`.

## Content model (TypeScript types)

```ts
// src/content/types.ts
export type Verse = {
  reference: string;        // "Romans 12:2"
  text: string;             // verbatim NIV
  translation?: 'NIV' | 'ESV' | 'NKJV';
};

export type DailyQuest = {
  day: 1|2|3|4|5|6|7;
  title: string;
  instructions: string;     // verbatim or derived per inventory
  durationSeconds?: number; // e.g., 180 for Week 1 gratitude
  kind: 'timer' | 'reflection' | 'declaration' | 'observation' | 'action';
  xpReward: number;
};

export type ContextualAlert = {
  severity: 'info' | 'warning' | 'danger';
  title: string;
  body: string;              // verbatim from PDF
  linkToSupport: boolean;
};

export type Week = {
  number: 1|2|3|4|5|6|7;
  title: string;
  subtitle: string;
  neuroscienceHook: string;  // verbatim body excerpt
  verses: Verse[];
  pullQuote: string;
  practices: string[];       // e.g., "Name it", "Refuse to spin it"
  discussionQuestions: string[];  // 3 items, verbatim
  resetChallenge: string;    // verbatim
  journalPrompt: string;     // verbatim
  dailyQuests: DailyQuest[]; // 7
  contextualAlerts?: ContextualAlert[];  // Week 4, Week 6
  culturalNote?: string;     // verbatim SA/Ubuntu/Kathu callouts
};
```

The `WEEKS: Week[]` export is a frozen const. Any drift from the PDF wording is a code-review failure. Diffs against `docs/content-inventory.md` should be trivial — the inventory doc *is* the spec.

## Theme tokens (Tailwind v4 `@theme`)

Electric / neon / sunset. Dark by default; light fallback available.

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Reboot energy palette */
  --color-reboot-bg:         #0B0F1A;  /* near-black navy */
  --color-reboot-surface:    #121826;
  --color-reboot-surface-2:  #1B2332;
  --color-reboot-text:       #F5F7FA;
  --color-reboot-muted:      #9AA5B1;

  --color-reboot-electric:   #3B82F6;  /* electric blue */
  --color-reboot-electric-2: #60A5FA;
  --color-reboot-neon:       #22D3A8;  /* neon green */
  --color-reboot-sunset:     #F97316;  /* reboot orange */
  --color-reboot-flame:      #FB7185;  /* streak flame pink-red */
  --color-reboot-violet:     #A78BFA;  /* week-7 accent */

  --color-reboot-success:    #10B981;
  --color-reboot-warning:    #F59E0B;
  --color-reboot-danger:     #EF4444;

  --radius-reboot:           14px;
  --radius-reboot-lg:        22px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

Mobile-first breakpoints: default (< 640), `sm`, `md`. No `lg`/`xl`-specific layouts for v1 — the app is a phone experience first.

## Gamification rules (proposed — locked at Gate 3)

| Action | XP | Side effects |
|---|---|---|
| Complete a daily quest | **+25 XP** | Streak +1 if first quest of day; may unlock badge |
| Write a journal entry | **+15 XP** | Counts toward "Scribe" badges |
| Voice journal ≥ 30s | **+20 XP** | Additive to text entry |
| React on community | **+2 XP** | Capped at 10 reactions/day |
| First post in community | **+10 XP** | One-shot |
| Complete a full week (≥ 6 of 7 days) | **+100 XP bonus** | Unlocks next week |
| 7-day streak | **+50 XP bonus** | Flame tier up |
| Finish all 7 weeks | **+300 XP** | "Reset Complete" mega-badge + Journey Summary unlock |

**Levels:** `level = floor(sqrt(totalXp / 50))` — level 1 at 50 XP, level 5 at 1250, level 10 at 5000. Caps at level 15 for v1.

**Streak flame tiers:**
- 🔥 Spark (1–2 days)
- 🔥🔥 Steady (3–6)
- 🔥🔥🔥 Blaze (7–13)
- 🔥🔥🔥🔥 Inferno (14+)

**Week unlock rule:** Week N unlocks when Week (N-1) has ≥ 6 completed daily quests OR when 7 calendar days have passed since Week (N-1) was unlocked (grace path — don't punish kids who miss a day).

## Badge catalogue (v1 — 14 badges, matches DB seed at Gate 3)

| slug | name | emoji | criteria |
|---|---|---|---|
| `first-reset` | First Reset | 🚀 | Complete your first daily quest |
| `flame-spark` | Flame Spark | 🔥 | 2-day streak |
| `flame-steady` | Flame Steady | 🔥🔥 | 3-day streak |
| `flame-blaze` | Blaze | 🔥🔥🔥 | 7-day streak |
| `flame-inferno` | Inferno | 🔥🔥🔥🔥 | 14-day streak |
| `week-1-done` | Rebooted | 🧠 | Finish Week 1 |
| `week-2-done` | Feels Fluent | 💙 | Finish Week 2 |
| `week-3-done` | Word Warrior | 🗣️ | Finish Week 3 |
| `week-4-done` | Rooted | 🌳 | Finish Week 4 |
| `week-5-done` | Unseen Faithful | 🕯️ | Finish Week 5 |
| `week-6-done` | Iron Sharpener | ⚔️ | Finish Week 6 |
| `week-7-done` | Purposeful | 🎯 | Finish Week 7 |
| `reset-complete` | Reset Complete | 👑 | Finish all 7 weeks |
| `scribe` | Scribe | 📓 | 10 journal entries |

## Offline strategy

**What works offline (v1):**
- Reading any week/day content (all hard-coded in bundle)
- Reading already-loaded journal entries (cached in IDB)
- Writing new journal entries (queued in IDB outbox, flushed on `online`)
- Completing a quest (queued as `quest_completion` intent; XP computed optimistically from client, reconciled on sync)

**What requires network (v1, acceptable for a youth-group app):**
- Community feed (read + write)
- Push subscribe
- Leader dashboard

**Outbox pattern:**
```
IDB stores:
  journal_entries    (id, body, voiceBlob?, photoBlob?, createdAt, syncState)
  quest_completions  (weekNumber, dayNumber, completedAt, syncState)
  reactions_queue    (postId, reaction, syncState)

syncState: 'pending' | 'syncing' | 'synced' | 'error'
```
On `window 'online'` event, flush each store in order. Conflict resolution: `journal_entries.client_id` (UUID generated offline) is a UNIQUE column in Postgres — duplicate uploads are idempotent.

**Service worker caching:**
- `app-shell` — precache on install: `/`, `/sign-in`, `/offline.html`, core JS/CSS
- `runtime-pages` — stale-while-revalidate for `/week/*`, `/journal`, `/profile`
- `runtime-api` — network-only for `/api/*`
- `runtime-images` — cache-first for `/icons/*`, `_next/image`
- fallback to `/offline.html` on navigation failure

## Push notification strategy

- Server holds VAPID private key in Supabase secret
- Client reads public key from `/api/push/vapid-public`
- On opt-in, browser `PushSubscription` → POST `/api/push/subscribe` → stored in `push_subscriptions` table (user FK)
- A Supabase Edge Function `send-push` is invoked by a pg_cron job every morning at 07:30 Africa/Johannesburg, sending each active user their localised Kathu message
- Copy lives in `src/content/push-messages.ts` (verbatim Kathu flavour: "Howzit — your 3-minute reset is waiting. Before the phone, the reboot 👊")
- One daily morning nudge + one optional evening journal nudge. User can disable either in Profile.

## Accessibility + localisation

- Touch targets ≥ 44×44 (Apple HIG)
- `prefers-reduced-motion` respected for confetti, ring animations, sheets
- All Scripture marked up with `<blockquote cite="https://www.biblegateway.com/…">`
- English primary; Afrikaans glossary on `/support`; full AF localisation deferred to Phase 2
- `lang="en-ZA"` on `<html>`, `timezone="Africa/Johannesburg"` used for streak rollover

## Open decisions for Gate 3

1. **Service worker: hand-rolled vs. `@serwist/next`.** I lean hand-rolled at this scale. Will confirm when installing deps.
2. **`framer-motion` vs. `motion` (v11 rebrand).** Same library, different package name. Latest `motion` package.
3. **BibleGateway deep links** for each verse tap? Adds network dep. Proposal: yes, `rel="noopener noreferrer" target="_blank"`, but ship with the text readable without the tap.
4. **Anonymous community display names.** Generator from `src/lib/utils/anon.ts` (e.g., `Kathu Lion 3421`)? Or let users pick a handle stored on `profiles.display_name`? I'll default to **generator** for safety; users can override.

None of these block Gate 2 approval — flagging so you're not surprised.
