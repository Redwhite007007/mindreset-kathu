import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";
import type { Database } from "./types";

type CookieEntry = { name: string; value: string; options?: CookieOptions };

/**
 * Server-side Supabase client for RSC / Route Handlers / Server Actions.
 * Returns null when Supabase is not configured (local demo mode).
 */
export async function createSupabaseServerClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  const cookieStore = await cookies();
  return createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(list: CookieEntry[]) {
        try {
          list.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — cookies are read-only here.
          // Middleware refreshes the session; this silent catch is fine.
        }
      },
    },
  });
}
