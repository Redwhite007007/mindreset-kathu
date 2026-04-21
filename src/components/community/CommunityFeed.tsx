"use client";

import type { FeedPost } from "@/lib/community/types";
import { PostCard } from "./PostCard";
import { useRealtimeRefresh } from "@/hooks/useRealtimeRefresh";

export function CommunityFeed({
  posts,
  currentUserId,
  canModerate,
  cohortId,
}: {
  posts: FeedPost[];
  currentUserId: string | null;
  canModerate: boolean;
  cohortId: string | null;
}) {
  useRealtimeRefresh(cohortId);

  if (posts.length === 0) {
    return (
      <div className="rounded-[22px] border border-dashed border-white/10 p-6 text-center">
        <div className="text-3xl">🌱</div>
        <p className="mt-2 text-sm font-semibold">Be the first to post</p>
        <p className="mt-1 text-xs text-[var(--color-reboot-muted)]">
          A win from today, a question, or a verse that hit. Short is fine.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {posts.map((p) => (
        <li key={p.id}>
          <PostCard post={p} currentUserId={currentUserId} canModerate={canModerate} />
        </li>
      ))}
    </ul>
  );
}
