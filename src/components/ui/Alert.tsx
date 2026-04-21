import * as React from "react";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Severity = "info" | "warning" | "danger";

const palette: Record<Severity, string> = {
  info: "border-[var(--color-reboot-electric)]/40 bg-[var(--color-reboot-electric)]/10",
  warning: "border-[var(--color-reboot-warning)]/40 bg-[var(--color-reboot-warning)]/10",
  danger: "border-[var(--color-reboot-danger)]/40 bg-[var(--color-reboot-danger)]/10",
};

const Icon: Record<Severity, React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  danger: ShieldAlert,
};

export function Alert({
  severity,
  title,
  children,
  linkToSupport,
  className,
}: {
  severity: Severity;
  title: string;
  children: React.ReactNode;
  linkToSupport?: boolean;
  className?: string;
}) {
  const IconComponent = Icon[severity];
  return (
    <div
      className={cn(
        "flex gap-3 rounded-[18px] border p-4 text-sm text-[var(--color-reboot-text)]",
        palette[severity],
        className,
      )}
      role={severity === "danger" ? "alert" : "note"}
    >
      <IconComponent className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div className="space-y-2">
        <div className="font-semibold">{title}</div>
        <div className="text-[var(--color-reboot-muted)]">{children}</div>
        {linkToSupport && (
          <Link
            href="/support"
            className="inline-block font-semibold text-[var(--color-reboot-electric)] underline underline-offset-4"
          >
            Get help →
          </Link>
        )}
      </div>
    </div>
  );
}
