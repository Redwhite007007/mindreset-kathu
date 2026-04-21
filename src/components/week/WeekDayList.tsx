"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import type { Week } from "@/content/types";
import { useLocalState } from "@/hooks/useLocalState";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export function WeekDayList({ week }: { week: Week }) {
  const state = useLocalState();
  const done = state.completions[week.number] ?? {};
  return (
    <Card>
      <h2 className="text-lg font-bold tracking-tight">7 daily quests</h2>
      <ul className="mt-3 space-y-2">
        {week.dailyQuests.map((q) => {
          const isDone = Boolean(done[q.day]);
          return (
            <li key={q.day}>
              <Link
                href={`/week/${week.number}/quest/${q.day}`}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-2xl border p-3 transition",
                  isDone
                    ? "border-[var(--color-reboot-neon)]/40 bg-[var(--color-reboot-neon)]/10"
                    : "border-white/10 bg-[var(--color-reboot-surface-2)] hover:border-white/30",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-xl text-xs font-black",
                      isDone
                        ? "bg-[var(--color-reboot-neon)] text-[var(--color-reboot-bg)]"
                        : "bg-[var(--color-reboot-surface)] text-[var(--color-reboot-muted)]",
                    )}
                    aria-hidden
                  >
                    {isDone ? <Check className="h-4 w-4" /> : q.day}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{q.title}</div>
                    <div className="text-xs text-[var(--color-reboot-muted)]">
                      {q.durationSeconds
                        ? `${Math.round(q.durationSeconds / 60)} min`
                        : "Short practice"}
                      {" · "}
                      +{q.xpReward} XP
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[var(--color-reboot-muted)]" aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
