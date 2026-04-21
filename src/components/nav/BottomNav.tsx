"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, PenLine, Users, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/week/1", label: "Weeks", icon: BookOpen, matches: "/week" },
  { href: "/community", label: "Crew", icon: Users, matches: "/community" },
  { href: "/journal", label: "Journal", icon: PenLine, matches: "/journal" },
  { href: "/profile", label: "Profile", icon: User, matches: "/profile" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-[var(--color-reboot-bg)]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 pt-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            ("matches" in item && pathname.startsWith(item.matches as string));
          const Icon = item.icon;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition",
                  active
                    ? "text-[var(--color-reboot-electric)]"
                    : "text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-text)]",
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
