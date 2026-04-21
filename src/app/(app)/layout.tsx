import type { ReactNode } from "react";
import { TopBar } from "@/components/nav/TopBar";
import { BottomNav } from "@/components/nav/BottomNav";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="has-bottom-nav min-h-dvh">
      <TopBar />
      <main className="mx-auto max-w-md px-5 py-6">{children}</main>
      <BottomNav />
    </div>
  );
}
