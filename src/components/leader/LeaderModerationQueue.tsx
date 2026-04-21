"use client";

import { EyeOff, Check } from "lucide-react";
import type { LeaderReport } from "@/lib/community/queries";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { hidePost, dismissReports } from "@/lib/community/actions";
import { formatRelative } from "@/lib/utils/date";

export function LeaderModerationQueue({ reports }: { reports: LeaderReport[] }) {
  if (reports.length === 0) {
    return (
      <Card className="text-center">
        <div className="text-3xl">✨</div>
        <p className="mt-2 text-sm font-semibold">No open reports</p>
        <p className="mt-1 text-xs text-[var(--color-reboot-muted)]">
          Nothing needs your attention right now.
        </p>
      </Card>
    );
  }

  // Group by post
  const grouped = new Map<string, LeaderReport[]>();
  for (const r of reports) {
    if (!grouped.has(r.postId)) grouped.set(r.postId, []);
    grouped.get(r.postId)!.push(r);
  }

  return (
    <Card>
      <h2 className="text-lg font-bold tracking-tight">Moderation queue</h2>
      <p className="mt-1 text-xs text-[var(--color-reboot-muted)]">
        Posts your cohort has flagged. Review, hide, or dismiss.
      </p>
      <ul className="mt-3 space-y-3">
        {Array.from(grouped.entries()).map(([postId, group]) => {
          const first = group[0]!;
          return (
            <li
              key={postId}
              className="rounded-2xl border border-[var(--color-reboot-danger)]/30 bg-[var(--color-reboot-danger)]/5 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-danger)]">
                  {group.length} report{group.length === 1 ? "" : "s"}
                </span>
                <span className="text-xs text-[var(--color-reboot-muted)]">
                  {formatRelative(first.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-xs text-[var(--color-reboot-muted)]">
                By {first.postAuthorHandle}
                {first.postIsHidden && " · already hidden"}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-[var(--color-reboot-text)]/90">
                {first.postBody}
              </p>
              <details className="mt-2 text-xs text-[var(--color-reboot-muted)]">
                <summary className="cursor-pointer font-semibold">
                  Reasons ({group.length})
                </summary>
                <ul className="mt-1 list-disc pl-4">
                  {group.map((r, i) => (
                    <li key={i}>
                      {r.reporterHandle}: {r.reason ?? "(no reason given)"}
                    </li>
                  ))}
                </ul>
              </details>
              <div className="mt-3 flex flex-wrap gap-2">
                {!first.postIsHidden && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={async () => {
                      const reason = prompt("Why hide this post?", "Violates community guidelines");
                      if (!reason) return;
                      await hidePost(postId, reason);
                    }}
                  >
                    <EyeOff className="h-3.5 w-3.5" aria-hidden /> Hide post
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    if (!confirm("Dismiss these reports without hiding?")) return;
                    await dismissReports(postId);
                  }}
                >
                  <Check className="h-3.5 w-3.5" aria-hidden /> Dismiss reports
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
