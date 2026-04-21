import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isLocalOnlyMode } from "@/lib/supabase/env";
import { loadLeaderCohort, loadModerationQueue } from "@/lib/community/queries";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LeaderCohortTable } from "@/components/leader/LeaderCohortTable";
import { LeaderModerationQueue } from "@/components/leader/LeaderModerationQueue";
import { Alert } from "@/components/ui/Alert";

export const dynamic = "force-dynamic";

export default async function LeaderPage() {
  if (isLocalOnlyMode()) {
    return (
      <div className="space-y-5">
        <Header />
        <Card className="text-center">
          <div className="text-3xl">🛠️</div>
          <p className="mt-2 text-sm font-semibold">Connect Supabase to use the leader tools</p>
          <p className="mt-1 text-xs text-[var(--color-reboot-muted)]">
            The leader dashboard needs the database. See the README for setup.
          </p>
        </Card>
      </div>
    );
  }

  const me = await getCurrentUser();
  if (!me) {
    return (
      <div className="space-y-5">
        <Header />
        <Card className="space-y-3 text-center">
          <p className="text-sm">Sign in to access the leader dashboard.</p>
          <Link href="/sign-in" className="inline-block">
            <Button>Sign in</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (me.role === "youth") {
    return (
      <div className="space-y-5">
        <Header />
        <Card className="text-center">
          <div className="text-3xl">🙋</div>
          <p className="mt-2 text-sm font-semibold">Leader tools only</p>
          <p className="mt-1 text-xs text-[var(--color-reboot-muted)]">
            This page is for CRC Kathu youth leaders. If that&apos;s you and you don&apos;t
            have access, ask an admin to upgrade your account role.
          </p>
        </Card>
      </div>
    );
  }

  const [cohort, reports] = await Promise.all([
    loadLeaderCohort(),
    loadModerationQueue(),
  ]);

  return (
    <div className="space-y-5">
      <Header />
      <Alert severity="info" title="Privacy reminder">
        You can see cohort XP, streak, and quest counts — not journal entries. That
        privacy is not negotiable. If a youth shares something with you, they had to
        show it to you themselves.
      </Alert>
      <LeaderModerationQueue reports={reports ?? []} />
      <LeaderCohortTable
        members={cohort?.members ?? []}
        cohortName={cohort?.cohortName ?? null}
      />
    </div>
  );
}

function Header() {
  return (
    <header className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
        Leader dashboard
      </p>
      <h1 className="text-3xl font-black tracking-tight">Hold the line, shepherd</h1>
      <p className="text-sm text-[var(--color-reboot-muted)]">
        Quick look at your cohort and any posts flagged for review.
      </p>
    </header>
  );
}
