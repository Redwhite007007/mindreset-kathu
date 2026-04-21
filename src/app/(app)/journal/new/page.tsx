import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { JournalEditor } from "@/components/journal/JournalEditor";

export default function NewJournalPage() {
  return (
    <div className="space-y-5">
      <Link
        href="/journal"
        className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-text)]"
      >
        <ChevronLeft className="h-3 w-3" aria-hidden /> Journal
      </Link>
      <JournalEditor />
    </div>
  );
}
