import type { Week, WeekNumber } from "../types";
import week1 from "./week-1";
import week2 from "./week-2";
import week3 from "./week-3";
import week4 from "./week-4";
import week5 from "./week-5";
import week6 from "./week-6";
import week7 from "./week-7";

export const WEEKS: readonly Week[] = [week1, week2, week3, week4, week5, week6, week7] as const;

export function getWeek(n: WeekNumber): Week {
  const w = WEEKS.find((w) => w.number === n);
  if (!w) throw new Error(`No week ${n}`);
  return w;
}

export function totalQuestsInWeek(n: WeekNumber): number {
  return getWeek(n).dailyQuests.length;
}
