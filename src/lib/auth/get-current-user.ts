import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/supabase/types";

export type CurrentUser = {
  id: string;
  email: string | null;
  displayName: string;
  avatarEmoji: string;
  role: UserRole;
  cohortId: string | null;
};

type ProfileRow = {
  display_name: string;
  avatar_emoji: string;
  role: UserRole;
  cohort_id: string | null;
};

/**
 * Returns the current user if signed in via Supabase, or null.
 * In local-only mode, always returns null — the UI falls back to the
 * local store for state.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_emoji, role, cohort_id")
    .eq("id", user.id)
    .maybeSingle();

  const p = profile as ProfileRow | null;

  return {
    id: user.id,
    email: user.email ?? null,
    displayName: p?.display_name ?? "Friend",
    avatarEmoji: p?.avatar_emoji ?? "🔥",
    role: p?.role ?? "youth",
    cohortId: p?.cohort_id ?? null,
  };
}
