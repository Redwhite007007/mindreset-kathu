import type { Week } from "@/content/types";
import { Card } from "@/components/ui/Card";
import { QuestScriptureCard } from "@/components/quest/QuestScriptureCard";

export function WeekDiscussion({ week }: { week: Week }) {
  return (
    <div className="space-y-5">
      <Card>
        <h2 className="text-lg font-bold tracking-tight">Reset challenge</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-reboot-text)]/90">
          {week.resetChallenge}
        </p>
      </Card>

      <QuestScriptureCard verses={week.verses} />

      <Card>
        <h2 className="text-lg font-bold tracking-tight">Practices</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--color-reboot-text)]/90 marker:text-[var(--color-reboot-electric)]">
          {week.practices.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-lg font-bold tracking-tight">Discussion questions</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--color-reboot-text)]/90 marker:font-bold marker:text-[var(--color-reboot-neon)]">
          {week.discussionQuestions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
