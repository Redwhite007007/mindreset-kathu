import * as React from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[14px] font-semibold tracking-tight transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-reboot-bg)] focus-visible:ring-[var(--color-reboot-electric)]";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-reboot-electric)] text-white shadow-[0_8px_24px_-6px_rgba(59,130,246,0.5)] hover:brightness-110",
  secondary:
    "bg-[var(--color-reboot-surface-2)] text-[var(--color-reboot-text)] hover:bg-white/10",
  ghost: "bg-transparent text-[var(--color-reboot-text)] hover:bg-white/5",
  danger: "bg-[var(--color-reboot-danger)] text-white hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-14 px-6 text-lg",
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  ),
);
Button.displayName = "Button";
