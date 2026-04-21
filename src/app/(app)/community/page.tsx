import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { loadCohortFeed } from "@/lib/community/queries";
import { isLocalOnlyMode } from "@/lib/supabase/env";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { CommunityComposer } from "@/components/community/CommunityComposer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const localOnly = isLocalOnlyMode();

  if (localOnly) {
    return <LocalOnlyState />;
  }

  const me = await getCurrentUser();
  if (!me) {
    return (
      <div className="space-y-5">
        <Header />
        <Card className="space-y-3 text-center">
          <div className="text-4xl">🫂</div>
          <h2 className="text-xl font-bold">Sign in to join the crew</h2>
          <p className="text-sm text-[var(--color-reboot-muted)]">
            Community is only visible to signed-in CRC Kathu youth in your cohort.
          </p>
          <Link href="/sign-in" className="inline-block">
            <Button>Sign in</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;
  const posts = await loadCohortFeed(PAGE_SIZE, offset);
  const hasMore = (posts?.length ?? 0) === PAGE_SIZE;

  return (
    <div className="space-y-5">
      <Header />
      {!me.cohortId ? (
        <Alert
          severity="info"
          title="You're not in a cohort yet"
          linkToSupport
        >
          Ask your CRC Kathu youth leader for the invite code. Until then, the community
          feed is empty for you — but your journal and quests all work.
        </Alert>
      ) : (
        <>
          <CommunityComposer />
          <CommunityFeed
            posts={posts ?? []}
            currentUserId={me.id}
            canModerate={me.role !== "youth"}
            cohortId={me.cohortId}
          />
          <Pagination page={page} hasMore={hasMore} />
        </>
      )}
    </div>
  );
}

function Pagination({ page, hasMore }: { page: number; hasMore: boolean }) {
  if (page === 1 && !hasMore) return null;
  return (
    <nav className="flex items-center justify-between gap-3 text-sm">
      {page > 1 ? (
        <Link
          href={page === 2 ? "/community" : `/community?page=${page - 1}`}
          className="rounded-2xl border border-[var(--color-reboot-surface-2)] bg-[var(--color-reboot-surface)] px-4 py-2 font-medium text-[var(--color-reboot-text)] hover:border-[var(--color-reboot-electric)] transition-colors"
        >
          ← Newer
        </Link>
      ) : (
        <span />
      )}
      <span className="text-[var(--color-reboot-muted)]">Page {page}</span>
      {hasMore ? (
        <Link
          href={`/community?page=${page + 1}`}
          className="rounded-2xl border border-[var(--color-reboot-surface-2)] bg-[var(--color-reboot-surface)] px-4 py-2 font-medium text-[var(--color-reboot-text)] hover:border-[var(--color-reboot-electric)] transition-colors"
        >
          Older →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

function Header() {
  return (
    <header className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
        Community
      </p>
      <h1 className="text-3xl font-black tracking-tight">CRC Kathu crew feed</h1>
      <p className="text-sm text-[var(--color-reboot-muted)]">
        Anonymised wins, questions, and honest moments. Only your cohort can see these.
      </p>
    </header>
  );
}

function LocalOnlyState() {
  return (
    <div className="space-y-5">
      <Header />
      <Card className="space-y-3 text-center">
        <div className="text-4xl">📡</div>
        <h2 className="text-xl font-bold">Community is offline</h2>
        <p className="text-sm text-[var(--color-reboot-muted)]">
          You&apos;re running in local-only mode. Connect this app to Supabase (see
          README) to unlock the cohort feed, reactions, and leader moderation. Your
          quests, streak, and private journal all keep working here.
        </p>
      </Card>
    </div>
  );
}
