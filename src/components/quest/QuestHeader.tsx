import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Week, DailyQuest } from "@/content/types";

export function QuestHeader({ week, quest }: { week: Week; quest: DailyQuest }) {
  return (
    <div className="space-y-3">
      <Link
        href={`/week/${week.number}`}
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-text)]"
      >
        <ChevronLeft className="h-3 w-3" aria-hidden /> Week {week.number} · {week.title}
      </Link>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-electric)]">
          Day {quest.day}
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight">{quest.title}</h1>
      </div>
    </div>
  );
}
