import { levelForXp } from "@/lib/gamification/levels";
import { cn } from "@/lib/utils/cn";

export function LevelBadge({ xp, className }: { xp: number; className?: string }) {
  const level = levelForXp(xp);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[var(--color-reboot-electric)]/40 bg-[var(--color-reboot-electric)]/10 px-2 py-0.5 text-xs font-bold text-[var(--color-reboot-electric)]",
        className,
      )}
    >
      Lvl {level}
    </span>
  );
}
