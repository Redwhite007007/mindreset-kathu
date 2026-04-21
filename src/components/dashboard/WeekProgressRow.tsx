"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useLocalState } from "@/hooks/useLocalState";
import { WEEKS } from "@/content/weeks";
import { isWeekUnlocked, weekProgressPct } from "@/lib/quests/unlock";
import { cn } from "@/lib/utils/cn";

export function WeekProgressRow() {
  const state = useLocalState();

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
          The 7-week reboot
        </h3>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {WEEKS.map((w) => {
          const unlocked = isWeekUnlocked(w.number, state.completions);
          const pct = weekProgressPct(w.number, state.completions);
          const complete = pct >= Math.round((6 / w.dailyQuests.length) * 100);
          return (
            <Link
              key={w.number}
              href={unlocked ? `/week/${w.number}` : "/"}
              aria-disabled={!unlocked}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-xl border text-xs font-black transition",
                unlocked
                  ? "border-white/10 bg-[var(--color-reboot-surface)] text-[var(--color-reboot-text)] hover:border-[var(--color-reboot-electric)]/60"
                  : "pointer-events-none border-white/5 bg-[var(--color-reboot-surface)]/40 text-[var(--color-reboot-muted)]",
                complete &&
                  "border-[var(--color-reboot-neon)]/60 bg-[var(--color-reboot-neon)]/10",
              )}
            >
              <span>W{w.number}</span>
              <span className="text-[10px] font-semibold opacity-70">{pct}%</span>
              {!unlocked && (
                <Lock className="absolute right-1 top-1 h-3 w-3 opacity-50" aria-hidden />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
