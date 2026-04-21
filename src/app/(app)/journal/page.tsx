import Link from "next/link";
import { ArrowLeft, PenLine } from "lucide-react";
import { JournalList } from "@/components/journal/JournalList";
import { Button } from "@/components/ui/Button";

export default function JournalPage() {
  return (
    <div className="space-y-5">
      <header className="space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-text)]">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Gratitude journal
            </p>
            <h1 className="text-3xl font-black tracking-tight text-[var(--color-reboot-electric)]">
              My Gratitude Journal
            </h1>
            <p className="mt-1 text-sm text-[var(--color-reboot-muted)]">
              Your private space to reflect and grow. Stored safely on your device.
            </p>
          </div>
          <Link href="/journal/new">
            <Button size="sm">
              <PenLine className="h-4 w-4" aria-hidden /> New entry
            </Button>
          </Link>
        </div>
      </header>
      <JournalList />
    </div>
  );
}
