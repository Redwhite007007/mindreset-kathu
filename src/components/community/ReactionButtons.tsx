"use client";

import type { ReactionType } from "@/lib/supabase/types";
import { REACTION_LABEL, REACTION_TYPES } from "@/lib/community/types";
import { toggleReaction } from "@/lib/community/actions";
import { cn } from "@/lib/utils/cn";
import { hapticTick } from "@/lib/utils/haptics";

export function ReactionButtons({
  postId,
  counts,
  mine,
}: {
  postId: string;
  counts: Record<ReactionType, number>;
  mine: readonly ReactionType[];
}) {
  const mineSet = new Set(mine);

  return (
    <ul className="flex flex-wrap gap-2">
      {REACTION_TYPES.map((r) => {
        const active = mineSet.has(r);
        const count = counts[r];
        return (
          <li key={r}>
            <button
              type="button"
              aria-label={REACTION_LABEL[r].label}
              aria-pressed={active}
              onClick={async () => {
                hapticTick();
                await toggleReaction(postId, r);
              }}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold transition",
                active
                  ? "border-[var(--color-reboot-electric)] bg-[var(--color-reboot-electric)]/15 text-[var(--color-reboot-text)]"
                  : "border-white/10 bg-[var(--color-reboot-surface-2)] text-[var(--color-reboot-muted)] hover:border-white/20",
              )}
            >
              <span aria-hidden>{REACTION_LABEL[r].emoji}</span>
              <span>{count > 0 ? count : ""}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
