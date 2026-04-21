import { Card, CardTitle } from "@/components/ui/Card";
import type { DailyQuest } from "@/content/types";

const KIND_LABEL: Record<DailyQuest["kind"], string> = {
  timer: "Timed practice",
  reflection: "Reflection",
  declaration: "Declaration",
  observation: "Observation",
  action: "Action",
};

export function QuestInstructions({ quest }: { quest: DailyQuest }) {
  return (
    <Card>
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
        {KIND_LABEL[quest.kind]}
      </p>
      <CardTitle className="mt-1">How to do it</CardTitle>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--color-reboot-text)]/90">
        {quest.instructions}
      </p>
    </Card>
  );
}
