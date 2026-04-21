"use client";

import { useLocalState } from "@/hooks/useLocalState";
import { levelForXp, xpProgressInLevel } from "@/lib/gamification/levels";
import { Card } from "@/components/ui/Card";
import { seriesPercent } from "@/lib/quests/today";

export function BrainRebootMeter() {
  const state = useLocalState();
  const level = levelForXp(state.totalXp);
  const { percent } = xpProgressInLevel(state.totalXp);
  const seriesPct = seriesPercent(state.completions);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--color-reboot-electric)]/20 blur-3xl" />
      <div className="relative text-center">
        <div className="relative mx-auto mb-4 h-40 w-40">
          <svg
            className="h-full w-full transform -rotate-90"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-[var(--color-reboot-surface-2)]"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="text-[var(--color-reboot-electric)] transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-black tracking-tight">{level}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Level
            </div>
          </div>
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-reboot-muted)] mb-2">
          Brain Reboot Meter
        </p>
        <p className="text-lg font-black tracking-tight mb-1">
          {state.totalXp} XP
        </p>
        <p className="text-xs text-[var(--color-reboot-muted)]">
          {percent.toFixed(0)}% to Level {Math.min(level + 1, 15)}
        </p>
        <div className="mt-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
            Series Progress
          </div>
          <div className="text-xl font-black tracking-tight text-[var(--color-reboot-neon)]">
            {seriesPct}%
          </div>
        </div>
      </div>
    </Card>
  );
}
