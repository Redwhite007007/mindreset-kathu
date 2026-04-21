import { Brain } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Week } from "@/content/types";

export function QuestNeuroscienceCard({ week }: { week: Week }) {
  return (
    <Card className="border-[var(--color-reboot-electric)]/30 bg-[var(--color-reboot-electric)]/5">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-reboot-electric)]/20 text-[var(--color-reboot-electric)]">
          <Brain className="h-5 w-5" aria-hidden />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-electric)]">
            Why this works
          </p>
          <p className="text-sm leading-relaxed text-[var(--color-reboot-text)]/90">
            {week.neuroscienceHook}
          </p>
          <blockquote className="border-l-2 border-[var(--color-reboot-electric)]/50 pl-3 text-sm italic text-[var(--color-reboot-muted)]">
            {week.pullQuote}
          </blockquote>
        </div>
      </div>
    </Card>
  );
}
