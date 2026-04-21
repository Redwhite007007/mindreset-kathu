import { BookOpen } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Verse } from "@/content/types";

export function QuestScriptureCard({ verses }: { verses: readonly Verse[] }) {
  if (!verses.length) return null;
  return (
    <Card className="border-[var(--color-reboot-neon)]/30 bg-[var(--color-reboot-neon)]/5">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-reboot-neon)]/20 text-[var(--color-reboot-neon)]">
          <BookOpen className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-neon)]">
            Scripture anchor
          </p>
          <ul className="space-y-3">
            {verses.map((v) => (
              <li key={v.reference} className="space-y-1">
                <p className="text-sm leading-relaxed text-[var(--color-reboot-text)]/90">
                  &ldquo;{v.text}&rdquo;
                </p>
                <p className="text-xs font-semibold text-[var(--color-reboot-muted)]">
                  {v.reference}
                  {v.translation ? ` · ${v.translation}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
