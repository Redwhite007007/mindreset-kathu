import { createSupabaseServerClient } from "@/lib/supabase/server";
import { levelForXp } from "@/lib/gamification/levels";
import type { FeedPost } from "./types";
import type { ReactionType } from "@/lib/supabase/types";
import { REACTION_TYPES } from "./types";

/**
 * Load the cohort feed for the current signed-in user.
 * Returns null when Supabase is not configured or the user is not signed in.
 * Returns [] if the user is signed in but has no cohort or no posts yet.
 */
export async function loadCohortFeed(limit = 20, offset = 0): Promise<FeedPost[] | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: me } = await supabase
    .from("profiles")
    .select("cohort_id")
    .eq("id", user.id)
    .maybeSingle();
  const m = me as { cohort_id: string | null } | null;
  if (!m?.cohort_id) return [];

  const { data: posts, error } = await supabase
    .from("community_posts")
    .select("id, author_id, cohort_id, body, week_number, is_hidden, hidden_reason, created_at")
    .eq("cohort_id", m.cohort_id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw new Error(`Failed to load community feed: ${error.message}`);
  if (!posts || posts.length === 0) return [];

  const authorIds = Array.from(new Set(posts.map((p) => p.author_id)));
  const postIds = posts.map((p) => p.id);

  const { data: authors } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_emoji, total_xp")
    .in("id", authorIds);
  const { data: reactions } = await supabase
    .from("post_reactions")
    .select("post_id, reaction")
    .in("post_id", postIds);
  const { data: myReactions } = await supabase
    .from("post_reactions")
    .select("post_id, reaction")
    .eq("user_id", user.id)
    .in("post_id", postIds);
  const { data: reports } = await supabase
    .from("post_reports")
    .select("post_id")
    .eq("resolved", false)
    .in("post_id", postIds);

  const authorsById = new Map((authors ?? []).map((a) => [a.id, a]));
  const counts = new Map<string, Record<ReactionType, number>>();
  for (const p of posts) {
    counts.set(p.id, { flame: 0, pray: 0, amen: 0, same: 0 });
  }
  for (const r of reactions ?? []) {
    const bucket = counts.get(r.post_id);
    if (bucket) bucket[r.reaction as ReactionType]++;
  }
  const myByPost = new Map<string, Set<ReactionType>>();
  for (const r of myReactions ?? []) {
    if (!myByPost.has(r.post_id)) myByPost.set(r.post_id, new Set());
    myByPost.get(r.post_id)!.add(r.reaction as ReactionType);
  }
  const reportCounts = new Map<string, number>();
  for (const r of reports ?? []) {
    reportCounts.set(r.post_id, (reportCounts.get(r.post_id) ?? 0) + 1);
  }

  return posts.map((p) => {
    const a = authorsById.get(p.author_id);
    return {
      id: p.id,
      authorId: p.author_id,
      authorHandle: a?.display_name ?? "Kathu Friend",
      authorEmoji: a?.avatar_emoji ?? "🔥",
      authorLevel: levelForXp(a?.total_xp ?? 0),
      cohortId: p.cohort_id,
      body: p.body,
      weekNumber: p.week_number,
      isHidden: p.is_hidden,
      hiddenReason: p.hidden_reason,
      createdAt: p.created_at,
      reactions: counts.get(p.id) ?? { flame: 0, pray: 0, amen: 0, same: 0 },
      myReactions: Array.from(myByPost.get(p.id) ?? []),
      reportCount: reportCounts.get(p.id) ?? 0,
    };
  });
}

export type LeaderCohortMember = {
  id: string;
  handle: string;
  emoji: string;
  level: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastQuestOn: string | null;
  questsCompleted: number;
};

export async function loadLeaderCohort(): Promise<{
  members: LeaderCohortMember[];
  cohortName: string | null;
} | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: me } = await supabase
    .from("profiles")
    .select("role, cohort_id")
    .eq("id", user.id)
    .maybeSingle();
  const m = me as { role: string; cohort_id: string | null } | null;
  if (!m || m.role === "youth" || !m.cohort_id) return null;

  const { data: cohort } = (await supabase
    .from("cohorts")
    .select("name")
    .eq("id", m.cohort_id)
    .maybeSingle()) as { data: { name: string } | null };

  const { data: members } = (await supabase
    .from("profiles")
    .select(
      "id, display_name, avatar_emoji, total_xp, current_streak, longest_streak, last_quest_completed_on",
    )
    .eq("cohort_id", m.cohort_id)
    .order("total_xp", { ascending: false })) as {
      data:
        | Array<{
            id: string;
            display_name: string;
            avatar_emoji: string;
            total_xp: number;
            current_streak: number;
            longest_streak: number;
            last_quest_completed_on: string | null;
          }>
        | null;
    };
  if (!members) return { members: [], cohortName: cohort?.name ?? null };

  const { data: completions } = (await supabase
    .from("quest_completions")
    .select("user_id")
    .in(
      "user_id",
      members.map((m) => m.id),
    )) as { data: { user_id: string }[] | null };
  const countByUser = new Map<string, number>();
  for (const c of completions ?? []) {
    countByUser.set(c.user_id, (countByUser.get(c.user_id) ?? 0) + 1);
  }

  return {
    cohortName: cohort?.name ?? null,
    members: members.map<LeaderCohortMember>((m) => ({
      id: m.id,
      handle: m.display_name,
      emoji: m.avatar_emoji,
      level: levelForXp(m.total_xp),
      totalXp: m.total_xp,
      currentStreak: m.current_streak,
      longestStreak: m.longest_streak,
      lastQuestOn: m.last_quest_completed_on,
      questsCompleted: countByUser.get(m.id) ?? 0,
    })),
  };
}

export type LeaderReport = {
  postId: string;
  reason: string | null;
  reporterHandle: string;
  createdAt: string;
  postBody: string;
  postAuthorHandle: string;
  postIsHidden: boolean;
};

export async function loadModerationQueue(): Promise<LeaderReport[] | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: me } = await supabase
    .from("profiles")
    .select("role, cohort_id")
    .eq("id", user.id)
    .maybeSingle();
  const m = me as { role: string; cohort_id: string | null } | null;
  if (!m || m.role === "youth") return null;

  const { data: reports } = (await supabase
    .from("post_reports")
    .select("post_id, reason, reporter_id, created_at")
    .eq("resolved", false)
    .order("created_at", { ascending: false })) as {
      data:
        | Array<{
            post_id: string;
            reason: string;
            reporter_id: string;
            created_at: string;
          }>
        | null;
    };
  if (!reports || reports.length === 0) return [];

  const postIds = Array.from(new Set(reports.map((r) => r.post_id)));
  const reporterIds = Array.from(new Set(reports.map((r) => r.reporter_id)));

  const { data: posts } = (await supabase
    .from("community_posts")
    .select("id, body, author_id, is_hidden")
    .in("id", postIds)) as {
      data:
        | Array<{
            id: string;
            body: string;
            author_id: string;
            is_hidden: boolean;
          }>
        | null;
    };
  const { data: profiles } = (await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", reporterIds)) as {
      data:
        | Array<{
            id: string;
            display_name: string;
          }>
        | null;
    };

  const postsById = new Map((posts ?? []).map((p) => [p.id, p]));
  const authorIds = Array.from(new Set((posts ?? []).map((p) => p.author_id)));
  const { data: authors } = (await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", authorIds)) as {
      data:
        | Array<{
            id: string;
            display_name: string;
          }>
        | null;
    };
  const authorsById = new Map((authors ?? []).map((a) => [a.id, a]));
  const reportersById = new Map((profiles ?? []).map((p) => [p.id, p]));

  return reports.map<LeaderReport>((r) => {
    const post = postsById.get(r.post_id);
    return {
      postId: r.post_id,
      reason: r.reason,
      reporterHandle: reportersById.get(r.reporter_id)?.display_name ?? "Anonymous",
      createdAt: r.created_at,
      postBody: post?.body ?? "[post not found]",
      postAuthorHandle: authorsById.get(post?.author_id ?? "")?.display_name ?? "Unknown",
      postIsHidden: post?.is_hidden ?? false,
    };
  });
}
