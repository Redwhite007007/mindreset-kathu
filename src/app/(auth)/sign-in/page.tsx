import Link from "next/link";
import { SignInForm } from "@/components/auth/SignInForm";
import { isLocalOnlyMode } from "@/lib/supabase/env";

export default function SignInPage() {
  const localOnly = isLocalOnlyMode();
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10">
      <div className="space-y-2 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[var(--color-reboot-electric)] to-[var(--color-reboot-neon)] text-2xl">
          🧠
        </div>
        <h1 className="text-3xl font-black tracking-tight">Welcome to MindReset Kathu</h1>
        <p className="text-sm text-[var(--color-reboot-muted)]">
          Sign in with your email. We&apos;ll send a magic link — no password to remember.
        </p>
      </div>

      <div className="mt-6">
        {localOnly ? (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-[var(--color-reboot-surface)] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Local-only mode
            </p>
            <p className="text-sm">
              Supabase is not configured, so your progress is stored on this device only.
              That&apos;s fine for getting started — you can continue without signing in.
            </p>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[var(--color-reboot-electric)] px-5 text-base font-semibold text-white"
            >
              Continue to dashboard
            </Link>
          </div>
        ) : (
          <SignInForm />
        )}
      </div>

      <p className="mt-6 text-center text-xs text-[var(--color-reboot-muted)]">
        Questions? Chat to a CRC Kathu youth leader or tap <Link href="/support" className="underline">Support</Link>.
      </p>
    </div>
  );
}
