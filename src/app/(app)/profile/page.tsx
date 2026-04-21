import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ProfileView } from "@/components/profile/ProfileView";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const me = await getCurrentUser();
  const isLeader = me && me.role !== "youth";

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
          Profile
        </p>
        <h1 className="text-3xl font-black tracking-tight">Your reset, your story</h1>
      </header>
      {isLeader && (
        <Card className="border-[var(--color-reboot-violet)]/40 bg-[var(--color-reboot-violet)]/5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-reboot-violet)]/20 text-[var(--color-reboot-violet)]">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-violet)]">
                Leader access
              </p>
              <p className="mt-1 text-sm">
                You have leader permissions for your cohort.
              </p>
              <Link
                href="/leader"
                className="mt-2 inline-block text-sm font-semibold text-[var(--color-reboot-violet)] underline underline-offset-4"
              >
                Open leader dashboard →
              </Link>
            </div>
          </div>
        </Card>
      )}
      <ProfileView />
    </div>
  );
}
