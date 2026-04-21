import { cn } from "@/lib/utils/cn";

type ProgressProps = {
  value: number; // 0-100
  className?: string;
  barClassName?: string;
};

export function Progress({ value, className, barClassName }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-white/10",
        className,
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-[var(--color-reboot-electric)] via-[var(--color-reboot-neon)] to-[var(--color-reboot-sunset)] transition-[width] duration-700 ease-out",
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
