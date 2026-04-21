"use client";

import Link from "next/link";
import { LifeBuoy } from "lucide-react";

export function TopBar({ title }: { title?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[var(--color-reboot-bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-reboot-electric)] to-[var(--color-reboot-neon)] text-lg">
            🧠
          </span>
          <span className="text-sm font-bold tracking-tight">{title ?? "MindReset Kathu"}</span>
        </Link>
        <Link
          href="/support"
          className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-text)]"
          aria-label="Get help"
        >
          <LifeBuoy className="h-4 w-4" />
          Help
        </Link>
      </div>
    </header>
  );
}
