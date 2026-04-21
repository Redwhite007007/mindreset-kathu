"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReactionType } from "@/lib/supabase/types";
import { REACTION_TYPES } from "./types";

type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function createPost(input: {
  body: string;
  weekNumber?: number | null;
}): Promise<ActionResult> {
  // Strip control characters (null bytes, escape sequences, etc.) while preserving newlines/tabs
  const body = (input.body ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
  if (!body) return { ok: false, error: "Write something first." };
  if (body.length > 1000) return { ok: false, error: "Please keep it under 1000 characters." };

  const supabase = await createSupabaseServerClient();
  if (!supabase)
    return {
      ok: false,
      error:
        "Community is offline — ask your leader for the invite link or connect Supabase.",
    };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in first." };

  const { data: me } = await supabase
    .from("profiles")
    .select("cohort_id")
    .eq("id", user.id)
    .maybeSingle();
  const m = me as { cohort_id: string | null } | null;
  if (!m?.cohort_id)
    return {
      ok: false,
      error: "You're not in a cohort yet. Ask your leader for the invite code.",
    };

  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      author_id: user.id,
      cohort_id: m.cohort_id,
      body,
      week_number: input.weekNumber ?? null,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  revalidatePath("/community");
  return { ok: true, id: data.id };
}

export async function toggleReaction(
  postId: string,
  reaction: ReactionType,
): Promise<ActionResult> {
  if (!REACTION_TYPES.includes(reaction))
    return { ok: false, error: "Unknown reaction." };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Offline." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in first." };

  const { data: existing } = await supabase
    .from("post_reactions")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .eq("reaction", reaction)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("post_reactions")
      .delete()
      .eq("user_id", user.id)
      .eq("post_id", postId)
      .eq("reaction", reaction);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase
      .from("post_reactions")
      .insert({ user_id: user.id, post_id: postId, reaction });
    if (error) return { ok: false, error: error.message };
  }
  revalidatePath("/community");
  return { ok: true };
}

export async function reportPost(
  postId: string,
  reason: string,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Offline." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in first." };
  const { error } = await supabase.from("post_reports").insert({
    post_id: postId,
    reporter_id: user.id,
    reason: reason || null,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/community");
  return { ok: true };
}

export async function hidePost(
  postId: string,
  hiddenReason: string,
): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Offline." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in first." };

  // RLS enforces leader scope — we don't re-check here.
  const { error } = await supabase
    .from("community_posts")
    .update({ is_hidden: true, hidden_reason: hiddenReason })
    .eq("id", postId);
  if (error) return { ok: false, error: error.message };

  // Resolve pending reports
  await supabase
    .from("post_reports")
    .update({ resolved: true, resolved_by: user.id, resolved_at: new Date().toISOString() })
    .eq("post_id", postId)
    .eq("resolved", false);

  revalidatePath("/community");
  revalidatePath("/leader");
  return { ok: true };
}

export async function dismissReports(postId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Offline." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in first." };
  const { error } = await supabase
    .from("post_reports")
    .update({ resolved: true, resolved_by: user.id, resolved_at: new Date().toISOString() })
    .eq("post_id", postId)
    .eq("resolved", false);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/leader");
  return { ok: true };
}

export async function deleteMyPost(postId: string): Promise<ActionResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Offline." };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in first." };
  const { error } = await supabase
    .from("community_posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/community");
  return { ok: true };
}
