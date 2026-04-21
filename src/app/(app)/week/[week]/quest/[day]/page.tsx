import { notFound } from "next/navigation";
import { WEEKS, getWeek } from "@/content/weeks";
import { isValidWeekNumber } from "@/lib/quests/today";
import type { DayNumber } from "@/content/types";
import { QuestRunner } from "@/components/quest/QuestRunner";

export function generateStaticParams() {
  return WEEKS.flatMap((w) =>
    w.dailyQuests.map((q) => ({ week: String(w.number), day: String(q.day) })),
  );
}

export default async function QuestPage({
  params,
}: {
  params: Promise<{ week: string; day: string }>;
}) {
  const { week: weekParam, day: dayParam } = await params;
  const n = Number(weekParam);
  const d = Number(dayParam);
  if (!isValidWeekNumber(n)) notFound();
  if (!Number.isInteger(d) || d < 1 || d > 7) notFound();
  const week = getWeek(n);
  const quest = week.dailyQuests.find((q) => q.day === (d as DayNumber));
  if (!quest) notFound();

  return <QuestRunner weekNumber={week.number} day={quest.day} />;
}
