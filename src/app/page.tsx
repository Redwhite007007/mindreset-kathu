"use client";

import Link from "next/link";
import { useLocalState } from "@/hooks/useLocalState";
import { BrainRebootMeter } from "@/components/dashboard/BrainRebootMeter";
import { TodayQuestCard } from "@/components/dashboard/TodayQuestCard";
import { StreakFlame } from "@/components/dashboard/StreakFlame";
import { WeekProgressRow } from "@/components/dashboard/WeekProgressRow";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const state = useLocalState();

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-4 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
          Howzit Kathu fam! 💥
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[var(--color-reboot-electric)] sm:text-4xl">
          Ready to reboot your mind today?
        </h1>
        <p className="mx-auto max-w-2xl text-base text-[var(--color-reboot-text)] sm:text-lg">
          One day at a time, let&apos;s get your brain firing on all cylinders with a warm reset for Kathu youth.
        </p>
        <div className="mx-auto flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-reboot-electric)]/25 bg-[var(--color-reboot-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-reboot-text)]">
            <span className="text-[var(--color-reboot-electric)]">XP</span>
            <span suppressHydrationWarning>{state.totalXp} total</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-reboot-flame)]/25 bg-[var(--color-reboot-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-reboot-text)]">
            <span className="text-[var(--color-reboot-flame)]">🔥</span>
            <span suppressHydrationWarning>Streak {state.currentStreak} day{state.currentStreak === 1 ? "" : "s"}</span>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(330px,420px)]">
        <div className="space-y-4">
          <BrainRebootMeter />
          <TodayQuestCard />
        </div>
        <div className="space-y-4">
          <StreakFlame />
          <div className="rounded-3xl border border-[var(--color-reboot-surface-2)] bg-[var(--color-reboot-surface)] p-5 shadow-[0_20px_60px_-48px_rgba(0,240,255,0.65)]">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Keep the reset going
            </p>
            <h2 className="mt-2 text-2xl font-black text-[var(--color-reboot-electric)]">
              Your journal in Kathu style
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-reboot-text)]/90">
              Capture your grateful moments, revisit what made today brighter, and keep the reset feeling alive.
            </p>
            <Link href="/journal" className="mt-4 inline-block w-full sm:w-auto">
              <Button className="w-full sm:w-auto">View Journal</Button>
            </Link>
          </div>
        </div>
      </div>

      <WeekProgressRow />
    </div>
  );
}
