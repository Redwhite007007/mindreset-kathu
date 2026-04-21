"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Listen to Supabase realtime channels and call router.refresh() when the
 * feed changes. No-op when Supabase isn't configured.
 */
export function useRealtimeRefresh(cohortId: string | null) {
  const router = useRouter();
  useEffect(() => {
    if (!cohortId) return;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`community:${cohortId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "community_posts",
          filter: `cohort_id=eq.${cohortId}`,
        },
        () => router.refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_reactions" },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cohortId, router]);
}
