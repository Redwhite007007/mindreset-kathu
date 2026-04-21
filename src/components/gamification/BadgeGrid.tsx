"use client";

import { BADGES } from "@/content/badges";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export function BadgeGrid({ earned }: { earned: readonly string[] }) {
  const earnedSet = new Set(earned);
  const sorted = [...BADGES].sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">Badges</h2>
        <span className="text-xs font-semibold text-[var(--color-reboot-muted)]">
          {earnedSet.size}/{BADGES.length}
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {sorted.map((b) => {
          const has = earnedSet.has(b.id);
          return (
            <li key={b.id}>
              <div
                className={cn(
                  "flex h-full flex-col items-center gap-1 rounded-2xl border p-3 text-center transition",
                  has
                    ? "border-[var(--color-reboot-neon)]/60 bg-[var(--color-reboot-neon)]/10"
                    : "border-white/5 bg-[var(--color-reboot-surface-2)]/50 opacity-50",
                )}
                title={b.description}
              >
                <span aria-hidden className="text-2xl">
                  {has ? b.emoji : "🔒"}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wide">
                  {b.name}
                </span>
                <span className="text-[10px] leading-tight text-[var(--color-reboot-muted)]">
                  {b.description}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
