"use client";

import { Trash2, EyeOff } from "lucide-react";
import type { FeedPost } from "@/lib/community/types";
import { Card } from "@/components/ui/Card";
import { formatRelative } from "@/lib/utils/date";
import { ReactionButtons } from "./ReactionButtons";
import { ReportDialog } from "./ReportDialog";
import { deleteMyPost, hidePost } from "@/lib/community/actions";

export function PostCard({
  post,
  currentUserId,
  canModerate,
}: {
  post: FeedPost;
  currentUserId: string | null;
  canModerate: boolean;
}) {
  const isMine = currentUserId === post.authorId;

  const onDelete = async () => {
    if (!confirm("Delete this post? This can't be undone.")) return;
    await deleteMyPost(post.id);
  };

  const onHide = async () => {
    const reason = prompt("Why hide this post?", "Violates community guidelines");
    if (!reason) return;
    await hidePost(post.id, reason);
  };

  return (
    <Card
      className={
        post.isHidden ? "border-[var(--color-reboot-warning)]/50 bg-[var(--color-reboot-warning)]/5" : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-reboot-surface-2)] text-xl"
          >
            {post.authorEmoji}
          </div>
          <div>
            <div className="text-sm font-bold">{post.authorHandle}</div>
            <div className="text-xs text-[var(--color-reboot-muted)]">
              Lvl {post.authorLevel}
              {post.weekNumber ? ` · Week ${post.weekNumber}` : ""}
              {" · "}
              {formatRelative(post.createdAt)}
            </div>
          </div>
        </div>
        {post.reportCount > 0 && canModerate && (
          <span className="rounded-full bg-[var(--color-reboot-danger)]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--color-reboot-danger)]">
            {post.reportCount} report{post.reportCount === 1 ? "" : "s"}
          </span>
        )}
      </div>

      {post.isHidden ? (
        <p className="mt-3 text-sm italic text-[var(--color-reboot-muted)]">
          This post was hidden by a leader
          {post.hiddenReason ? ` — ${post.hiddenReason}` : ""}.
        </p>
      ) : (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[var(--color-reboot-text)]/90">
          {post.body}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <ReactionButtons
          postId={post.id}
          counts={post.reactions}
          mine={post.myReactions}
        />
        <div className="flex items-center gap-3">
          {isMine && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-danger)]"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
            </button>
          )}
          {canModerate && !post.isHidden && (
            <button
              type="button"
              onClick={onHide}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-warning)]"
            >
              <EyeOff className="h-3.5 w-3.5" aria-hidden /> Hide
            </button>
          )}
          {!isMine && <ReportDialog postId={post.id} />}
        </div>
      </div>
    </Card>
  );
}
