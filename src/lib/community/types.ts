import type { ReactionType } from "@/lib/supabase/types";

export type FeedPost = {
  id: string;
  authorId: string;
  authorHandle: string;
  authorEmoji: string;
  authorLevel: number;
  cohortId: string;
  body: string;
  weekNumber: number | null;
  isHidden: boolean;
  hiddenReason: string | null;
  createdAt: string;
  reactions: Record<ReactionType, number>;
  myReactions: ReactionType[];
  reportCount: number;
};

export const REACTION_LABEL: Record<ReactionType, { emoji: string; label: string }> = {
  flame: { emoji: "🔥", label: "Same energy" },
  pray: { emoji: "🙏", label: "Praying" },
  amen: { emoji: "✨", label: "Amen" },
  same: { emoji: "🫶", label: "Same" },
};

export const REACTION_TYPES: ReactionType[] = ["flame", "pray", "amen", "same"];

export const REPORT_REASONS: readonly { id: string; label: string }[] = [
  { id: "harm", label: "Someone sounds at risk of harm (self or others)" },
  { id: "abuse", label: "Bullying, harassment, or hateful speech" },
  { id: "explicit", label: "Explicit or inappropriate content" },
  { id: "spam", label: "Spam or off-topic" },
  { id: "other", label: "Something else" },
] as const;
