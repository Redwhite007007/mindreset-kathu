export function getSupabaseEnv(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/** True if the app is in local-only demo mode (no Supabase env). */
export function isLocalOnlyMode(): boolean {
  return getSupabaseEnv() === null;
}
