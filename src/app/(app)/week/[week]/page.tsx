import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { WEEKS, getWeek } from "@/content/weeks";
import { isValidWeekNumber } from "@/lib/quests/today";
import { WeekHero } from "@/components/week/WeekHero";
import { WeekDayList } from "@/components/week/WeekDayList";
import { WeekDiscussion } from "@/components/week/WeekDiscussion";
import { Alert } from "@/components/ui/Alert";

export function generateStaticParams() {
  return WEEKS.map((w) => ({ week: String(w.number) }));
}

export default async function WeekPage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week: weekParam } = await params;
  const n = Number(weekParam);
  if (!isValidWeekNumber(n)) notFound();
  const week = getWeek(n);

  return (
    <div className="space-y-5">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-text)]"
      >
        <ChevronLeft className="h-3 w-3" aria-hidden /> Dashboard
      </Link>
      <WeekHero week={week} />
      {week.contextualAlerts?.map((a, i) => (
        <Alert key={i} severity={a.severity} title={a.title} linkToSupport={a.linkToSupport}>
          {a.body}
        </Alert>
      ))}
      <WeekDayList week={week} />
      <WeekDiscussion week={week} />
    </div>
  );
}
