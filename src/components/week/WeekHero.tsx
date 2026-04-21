import type { Week } from "@/content/types";
import { Card, CardSubtitle } from "@/components/ui/Card";

const ACCENT_BG: Record<Week["accentColor"], string> = {
  electric: "from-[var(--color-reboot-electric)] to-[var(--color-reboot-neon)]",
  neon: "from-[var(--color-reboot-neon)] to-[var(--color-reboot-electric)]",
  sunset: "from-[var(--color-reboot-sunset)] to-[var(--color-reboot-flame)]",
  flame: "from-[var(--color-reboot-flame)] to-[var(--color-reboot-sunset)]",
  violet: "from-[var(--color-reboot-violet)] to-[var(--color-reboot-electric)]",
};

export function WeekHero({ week }: { week: Week }) {
  return (
    <Card className="relative overflow-hidden">
      <div
        aria-hidden
        className={`absolute -right-20 -top-16 h-60 w-60 rounded-full bg-gradient-to-br ${ACCENT_BG[week.accentColor]} opacity-30 blur-3xl`}
      />
      <div className="relative space-y-3">
        <CardSubtitle className="font-bold uppercase tracking-widest">
          Week {week.number}
        </CardSubtitle>
        <h1 className="text-3xl font-black leading-tight tracking-tight">{week.title}</h1>
        <p className="text-sm text-[var(--color-reboot-muted)]">{week.subtitle}</p>
        <blockquote className="rounded-2xl border border-white/5 bg-[var(--color-reboot-surface-2)] p-3 text-sm italic text-[var(--color-reboot-text)]/90">
          &ldquo;{week.pullQuote}&rdquo;
        </blockquote>
        {week.culturalNote && (
          <p className="text-xs leading-relaxed text-[var(--color-reboot-muted)]">
            <span className="font-bold text-[var(--color-reboot-text)]">Kathu note — </span>
            {week.culturalNote}
          </p>
        )}
      </div>
    </Card>
  );
}
