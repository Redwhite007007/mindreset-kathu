import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-[22px] border border-white/5 bg-[var(--color-reboot-surface)] p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

export const CardTitle = ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
  <h2 className={cn("text-xl font-bold tracking-tight text-[var(--color-reboot-text)]", className)}>
    {children}
  </h2>
);

export const CardSubtitle = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => (
  <p className={cn("text-sm text-[var(--color-reboot-muted)]", className)}>{children}</p>
);
