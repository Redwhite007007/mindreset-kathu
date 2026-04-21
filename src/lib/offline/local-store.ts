"use client";

/**
 * Local-first store for MindReset Kathu.
 *
 * All progress is persisted to localStorage under a single JSON blob.
 * When Supabase is configured and the user is signed in, a separate sync
 * layer (src/lib/offline/sync.ts — Gate 5) replays the local state into
 * Postgres via the complete_quest RPC and the journal_entries table.
 *
 * This module is SSR-safe: every read/write is guarded for typeof window.
 */

import { generateAnonHandle } from "../utils/anon";
import { sastDateString } from "../utils/date";
import { nextStreak } from "../gamification/streak";
import {
  XP_PER_JOURNAL,
  XP_PER_QUEST,
  XP_VOICE_JOURNAL_BONUS,
} from "../gamification/xp";

const STORAGE_KEY = "mindreset-kathu/v1";

export type JournalEntry = {
  id: string;
  body: string;
  weekNumber?: number;
  dayNumber?: number;
  moodEmoji?: string;
  createdAt: string; // ISO
  voiceDataUrl?: string;
  voiceDurationSeconds?: number;
  photoDataUrl?: string;
  synced?: boolean;
};

export type LocalState = {
  version: 1;
  handle: string;
  avatarEmoji: string;
  createdAt: string;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedOn: string | null; // SAST YYYY-MM-DD
  // completions[weekNumber][dayNumber] = completedAtISO
  completions: Record<number, Record<number, string>>;
  badges: string[]; // badge ids earned
  journal: JournalEntry[];
  morningPushEnabled: boolean;
  eveningPushEnabled: boolean;
};

function emptyState(): LocalState {
  return {
    version: 1,
    handle: generateAnonHandle(),
    avatarEmoji: "🔥",
    createdAt: new Date().toISOString(),
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedOn: null,
    completions: {},
    badges: [],
    journal: [],
    morningPushEnabled: true,
    eveningPushEnabled: false,
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadLocalState(): LocalState {
  if (!isBrowser()) return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<LocalState>;
    if (parsed.version !== 1) return emptyState();
    return { ...emptyState(), ...parsed } as LocalState;
  } catch {
    return emptyState();
  }
}

function saveLocalState(state: LocalState): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("mindreset:state-changed"));
  } catch {
    /* quota or disabled — silent */
  }
}

export function resetLocalState(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("mindreset:state-changed"));
}

// ---------------- Mutations ----------------

type CompleteQuestResult = {
  awardedXp: number;
  currentStreak: number;
  newBadges: string[];
  replay: boolean;
};

export function completeQuestLocal(
  weekNumber: number,
  dayNumber: number,
  _durationSeconds?: number,
): CompleteQuestResult {
  const state = loadLocalState();

  state.completions[weekNumber] ??= {};
  if (state.completions[weekNumber][dayNumber]) {
    return { awardedXp: 0, currentStreak: state.currentStreak, newBadges: [], replay: true };
  }

  state.completions[weekNumber][dayNumber] = new Date().toISOString();

  const today = sastDateString();
  const newStreak = nextStreak(state.currentStreak, state.lastCompletedOn, today);
  state.currentStreak = newStreak;
  state.longestStreak = Math.max(state.longestStreak, newStreak);
  state.lastCompletedOn = today;
  state.totalXp += XP_PER_QUEST;

  const newBadges = evaluateBadges(state);

  saveLocalState(state);
  return { awardedXp: XP_PER_QUEST, currentStreak: newStreak, newBadges, replay: false };
}

export function addJournalLocal(
  entry: Omit<JournalEntry, "id" | "createdAt" | "synced">,
): { entry: JournalEntry; awardedXp: number } {
  const state = loadLocalState();
  const full: JournalEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    synced: false,
  };
  state.journal.unshift(full);
  const bonus = full.voiceDataUrl ? XP_VOICE_JOURNAL_BONUS : 0;
  const awarded = XP_PER_JOURNAL + bonus;
  state.totalXp += awarded;
  evaluateBadges(state);
  saveLocalState(state);
  return { entry: full, awardedXp: awarded };
}

export function deleteJournalLocal(id: string): void {
  const state = loadLocalState();
  state.journal = state.journal.filter((e) => e.id !== id);
  saveLocalState(state);
}

export function updateProfileLocal(patch: Partial<Pick<LocalState, "handle" | "avatarEmoji" | "morningPushEnabled" | "eveningPushEnabled">>): void {
  const state = loadLocalState();
  Object.assign(state, patch);
  saveLocalState(state);
}

// ---------------- Badge evaluation ----------------

function evaluateBadges(state: LocalState): string[] {
  const earned = new Set(state.badges);
  const gained: string[] = [];
  const add = (id: string) => {
    if (!earned.has(id)) {
      earned.add(id);
      gained.push(id);
    }
  };

  const totalQuests = Object.values(state.completions).reduce(
    (s, days) => s + Object.keys(days).length,
    0,
  );
  if (totalQuests >= 1) add("first-reset");

  if (state.currentStreak >= 2) add("flame-spark");
  if (state.currentStreak >= 3) add("flame-steady");
  if (state.currentStreak >= 7) add("flame-blaze");
  if (state.currentStreak >= 14) add("flame-inferno");

  for (let w = 1; w <= 7; w++) {
    const done = Object.keys(state.completions[w] ?? {}).length;
    if (done >= 6) add(`week-${w}-done`);
  }
  const weeksCompleted = [1, 2, 3, 4, 5, 6, 7].filter(
    (w) => Object.keys(state.completions[w] ?? {}).length >= 6,
  );
  if (weeksCompleted.length === 7) add("reset-complete");

  if (state.journal.length >= 10) add("scribe");

  state.badges = Array.from(earned);
  return gained;
}
