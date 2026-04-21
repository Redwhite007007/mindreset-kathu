import { getWeek } from "@/content/weeks";
import type { WeekNumber } from "@/content/types";

/**
 * A map of `week -> day -> truthy marker`.
 * Local state stores the completion timestamp as a string; the Supabase
 * hydration path stores literal `true`. Anything truthy counts as done.
 */
export type CompletionMap = Record<number, Record<number, string | boolean>>;

/** Returns true if a given week is unlocked for the user. */
export function isWeekUnlocked(
  week: WeekNumber,
  completions: CompletionMap,
  unlockedAt: Record<WeekNumber, string | null> = {} as Record<WeekNumber, string | null>,
): boolean {
  if (week === 1) return true;
  const prev = (week - 1) as WeekNumber;
  const prevDone = Object.keys(completions[prev] ?? {}).length;
  const prevTotal = getWeek(prev).dailyQuests.length;
  if (prevDone >= Math.max(6, prevTotal - 1)) return true;

  // Grace path: 7 calendar days after previous week unlocked
  const unlocked = unlockedAt[prev];
  if (unlocked) {
    const diff = Date.now() - new Date(unlocked).getTime();
    if (diff >= 7 * 86_400_000) return true;
  }
  return false;
}

export function weekProgressPct(week: WeekNumber, completions: CompletionMap): number {
  const done = Object.keys(completions[week] ?? {}).length;
  const total = getWeek(week).dailyQuests.length;
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
