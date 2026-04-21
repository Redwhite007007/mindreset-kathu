"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Auth not configured. Continue in local-only mode.");
      return;
    }
    startTransition(async () => {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      router.push(`/check-email?to=${encodeURIComponent(email.trim())}`);
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-2xl border border-white/10 bg-[var(--color-reboot-surface)] p-4">
      <label className="block space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
          Email
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="block w-full rounded-xl border border-white/10 bg-[var(--color-reboot-surface-2)] p-3 text-sm focus:border-[var(--color-reboot-electric)] focus:outline-none"
        />
      </label>
      {error && <p className="text-sm text-[var(--color-reboot-danger)]">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending || !email}>
        <Mail className="h-4 w-4" aria-hidden />
        {pending ? "Sending…" : "Send magic link"}
      </Button>
    </form>
  );
}
