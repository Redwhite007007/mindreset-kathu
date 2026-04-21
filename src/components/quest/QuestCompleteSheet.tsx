"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Sparkles, ArrowRight, PenLine } from "lucide-react";
import { useConfetti } from "@/hooks/useConfetti";
import { Button } from "@/components/ui/Button";
import { BADGES } from "@/content/badges";

export function QuestCompleteSheet({
  open,
  awardedXp,
  currentStreak,
  newBadges,
  nextWeek,
  nextDay,
  weekNumber,
  dayNumber,
  onClose,
}: {
  open: boolean;
  awardedXp: number;
  currentStreak: number;
  newBadges: string[];
  nextWeek: number | null;
  nextDay: number | null;
  weekNumber: number;
  dayNumber: number;
  onClose: () => void;
}) {
  const fire = useConfetti();
  useEffect(() => {
    if (open && awardedXp > 0) fire();
  }, [open, awardedXp, fire]);

  if (!open) return null;
  const badges = newBadges
    .map((id) => BADGES.find((b) => b.id === id))
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="complete-title"
    >
      <div className="w-full max-w-md space-y-4 rounded-[22px] border border-white/10 bg-[var(--color-reboot-surface)] p-6 shadow-2xl">
        <div className="flex items-center gap-2 text-[var(--color-reboot-neon)]">
          <Sparkles className="h-5 w-5" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-widest">
            Reboot logged
          </span>
        </div>
        <h2 id="complete-title" className="text-3xl font-black tracking-tight">
          Nice work.
        </h2>
        <p className="text-sm text-[var(--color-reboot-muted)]">
          Week {weekNumber} · Day {dayNumber} complete. Your brain just got a
          little more rewired on purpose.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[var(--color-reboot-surface-2)] p-3 text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              XP earned
            </div>
            <div className="text-2xl font-black">+{awardedXp}</div>
          </div>
          <div className="rounded-2xl bg-[var(--color-reboot-surface-2)] p-3 text-center">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Streak
            </div>
            <div className="text-2xl font-black">{currentStreak} 🔥</div>
          </div>
        </div>
        {badges.length > 0 && (
          <div className="rounded-2xl border border-[var(--color-reboot-sunset)]/40 bg-[var(--color-reboot-sunset)]/10 p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-sunset)]">
              New badges
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {badges.map((b) =>
                b ? (
                  <li
                    key={b.id}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--color-reboot-surface-2)] px-2 py-1 text-xs font-semibold"
                  >
                    <span aria-hidden>{b.emoji}</span>
                    {b.name}
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        )}
        <div className="flex flex-col gap-2 pt-2">
          <Link href="/journal/new" className="w-full">
            <Button variant="secondary" size="lg" className="w-full">
              <PenLine className="h-4 w-4" aria-hidden /> Journal this moment
            </Button>
          </Link>
          {nextWeek && nextDay ? (
            <Link href={`/week/${nextWeek}/quest/${nextDay}`} className="w-full">
              <Button size="lg" className="w-full">
                Next quest <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          ) : (
            <Link href="/" className="w-full">
              <Button size="lg" className="w-full">
                Back to dashboard <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[var(--color-reboot-muted)] underline underline-offset-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
