import type { LeaderCohortMember } from "@/lib/community/queries";
import { Card } from "@/components/ui/Card";
import { flameEmoji, flameTier } from "@/lib/gamification/streak";
import { formatRelative } from "@/lib/utils/date";

export function LeaderCohortTable({
  members,
  cohortName,
}: {
  members: LeaderCohortMember[];
  cohortName: string | null;
}) {
  return (
    <Card>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight">
            {cohortName ?? "Your cohort"}
          </h2>
          <p className="text-xs text-[var(--color-reboot-muted)]">
            {members.length} youth · Only aggregates visible. Journals are private.
          </p>
        </div>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-[var(--color-reboot-muted)]">
              <th className="pb-2">Youth</th>
              <th className="pb-2">Lvl</th>
              <th className="pb-2">Streak</th>
              <th className="pb-2">Quests</th>
              <th className="pb-2">Last active</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-white/5">
                <td className="py-2">
                  <span className="mr-2 text-lg" aria-hidden>
                    {m.emoji}
                  </span>
                  {m.handle}
                </td>
                <td className="py-2 font-semibold">{m.level}</td>
                <td className="py-2">
                  {m.currentStreak} {flameEmoji(flameTier(m.currentStreak))}
                </td>
                <td className="py-2">{m.questsCompleted} / 49</td>
                <td className="py-2 text-[var(--color-reboot-muted)]">
                  {m.lastQuestOn
                    ? formatRelative(`${m.lastQuestOn}T00:00:00Z`)
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
