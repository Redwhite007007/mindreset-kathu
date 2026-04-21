import Link from "next/link";
import { Mail } from "lucide-react";

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const { to } = await searchParams;
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-5 py-10 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-reboot-surface-2)] text-[var(--color-reboot-electric)]">
        <Mail className="h-6 w-6" aria-hidden />
      </div>
      <h1 className="mt-4 text-3xl font-black tracking-tight">Check your email</h1>
      <p className="mt-2 text-sm text-[var(--color-reboot-muted)]">
        {to ? (
          <>
            We sent a magic link to <span className="font-semibold text-[var(--color-reboot-text)]">{to}</span>.
          </>
        ) : (
          "We sent a magic link to your inbox."
        )}{" "}
        Open the email and tap the button to sign in.
      </p>
      <p className="mt-6 text-xs text-[var(--color-reboot-muted)]">
        Can&apos;t find it? Check your spam folder or{" "}
        <Link href="/sign-in" className="underline">
          try a different email
        </Link>
        .
      </p>
    </div>
  );
}
