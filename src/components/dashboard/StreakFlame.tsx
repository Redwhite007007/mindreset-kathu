"use client";

import { useLocalState } from "@/hooks/useLocalState";
import { flameEmoji, flameTier } from "@/lib/gamification/streak";
import { Card } from "@/components/ui/Card";

const COPY: Record<ReturnType<typeof flameTier>, { title: string; body: string }> = {
  none: {
    title: "No flame yet",
    body: "Complete a quest today to spark your streak.",
  },
  spark: {
    title: "Spark lit",
    body: "You showed up. Reboot one more day to build momentum.",
  },
  steady: {
    title: "Steady flame",
    body: "Three days in. Your brain is starting to rewire.",
  },
  blaze: {
    title: "Blazing",
    body: "A week strong — new pathways are forming.",
  },
  inferno: {
    title: "Inferno mode",
    body: "Two weeks. You are rebuilding your mind on purpose.",
  },
};

export function StreakFlame() {
  const state = useLocalState();
  const tier = flameTier(state.currentStreak);
  const copy = COPY[tier];
  const thresholds = [1, 3, 7, 14] as const;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-[var(--color-reboot-flame)]/20 blur-3xl" />
      <div className="relative space-y-4">
        <div className="flex items-center gap-4">
          <div
            aria-hidden
            className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--color-reboot-surface-2)] text-2xl"
          >
            {flameEmoji(tier)}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Reboot flame
            </p>
            <p className="text-2xl font-black tracking-tight">
              {state.currentStreak} day{state.currentStreak === 1 ? "" : "s"}
            </p>
            <p className="text-xs text-[var(--color-reboot-muted)]">
              {copy.title} — {copy.body}
            </p>
          </div>
          <div className="text-right text-xs text-[var(--color-reboot-muted)]">
            <div>Longest</div>
            <div className="text-lg font-black text-[var(--color-reboot-text)]">
              {state.longestStreak}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-[var(--color-reboot-muted)]">
          {thresholds.map((threshold) => {
            const active = state.currentStreak >= threshold;
            return (
              <div
                key={threshold}
                className={`rounded-2xl border p-3 text-sm ${
                  active
                    ? "border-[var(--color-reboot-electric)] bg-[var(--color-reboot-electric)]/10 text-[var(--color-reboot-text)]"
                    : "border-white/10 bg-[var(--color-reboot-surface)]"
                }`}
              >
                <div className="text-lg">🔥</div>
                <div className="mt-1 font-bold">{threshold}</div>
                <div className="text-[11px] uppercase tracking-[0.15em]">
                  {threshold === 1 ? "Spark" : threshold === 3 ? "Steady" : threshold === 7 ? "Blaze" : "Inferno"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
