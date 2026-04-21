/**
 * Local dev seed script.
 * Run after `supabase db reset` to create a sample cohort + leader.
 *
 * Usage:
 *   npx tsx supabase/seed.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in env (local supabase start exposes it).
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!key) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required for seeding.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  // Ensure default cohort (migration already seeds it, but idempotent)
  await supabase
    .from("cohorts")
    .upsert({ name: "CRC Kathu Youth 2026", slug: "crc-kathu-youth-2026" }, { onConflict: "slug" });

  const leaderEmail = process.env.NEXT_SEED_LEADER_EMAIL;
  if (leaderEmail) {
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: leaderEmail,
      email_confirm: true,
    });
    if (error && !error.message.includes("already registered")) {
      console.error("Failed to create leader user:", error.message);
    } else if (user?.user?.id) {
      await supabase.from("profiles").update({ role: "leader" }).eq("id", user.user.id);
      console.log(`Leader account ensured: ${leaderEmail}`);
    }
  } else {
    console.log("NEXT_SEED_LEADER_EMAIL not set — skipping leader seed.");
  }

  console.log("Seed complete ✔");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
