import { WEEKS, getWeek } from "@/content/weeks";
import type { DailyQuest, Week, WeekNumber } from "@/content/types";
import { isWeekUnlocked, type CompletionMap } from "./unlock";

export type TodayPick = {
  week: Week;
  quest: DailyQuest;
};

/**
 * Compute "today's quest": the earliest unlocked week that still has an
 * uncompleted day. If everything is done, return the last quest of Week 7.
 */
export function pickToday(completions: CompletionMap): TodayPick {
  for (const week of WEEKS) {
    if (!isWeekUnlocked(week.number, completions)) break;
    const done = completions[week.number] ?? {};
    const next = week.dailyQuests.find((q) => !done[q.day]);
    if (next) return { week, quest: next };
  }
  const last = getWeek(7);
  return { week: last, quest: last.dailyQuests[last.dailyQuests.length - 1]! };
}

export function countTotalCompletions(completions: CompletionMap): number {
  return Object.values(completions).reduce(
    (sum, days) => sum + Object.keys(days).length,
    0,
  );
}

export function totalQuestsAcrossSeries(): number {
  return WEEKS.reduce((s, w) => s + w.dailyQuests.length, 0);
}

export function seriesPercent(completions: CompletionMap): number {
  const total = totalQuestsAcrossSeries();
  return total === 0 ? 0 : Math.round((countTotalCompletions(completions) / total) * 100);
}

export function isValidWeekNumber(n: unknown): n is WeekNumber {
  return typeof n === "number" && n >= 1 && n <= 7 && Number.isInteger(n);
}
