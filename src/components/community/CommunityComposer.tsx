"use client";

import { useState, useTransition } from "react";
import { Send } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createPost } from "@/lib/community/actions";
import { hapticSuccess } from "@/lib/utils/haptics";

const MAX = 1000;

export function CommunityComposer({ defaultWeek }: { defaultWeek?: number }) {
  const [body, setBody] = useState("");
  const [week, setWeek] = useState<number | null>(defaultWeek ?? null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const text = body.trim();
    if (!text) return;
    startTransition(async () => {
      const r = await createPost({ body: text, weekNumber: week });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      hapticSuccess();
      setBody("");
    });
  };

  return (
    <Card className="space-y-3">
      <CardTitle>Share with the CRC Kathu crew</CardTitle>
      <p className="text-xs text-[var(--color-reboot-muted)]">
        Your handle is anonymised — nothing ties this post to your real name. Be kind.
      </p>
      <form onSubmit={onSubmit} className="space-y-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, MAX))}
          rows={4}
          placeholder="One honest sentence. A win, a question, a verse that landed. Anything real."
          className="block w-full rounded-2xl border border-white/10 bg-[var(--color-reboot-surface-2)] p-3 text-sm leading-relaxed placeholder:text-[var(--color-reboot-muted)] focus:border-[var(--color-reboot-electric)] focus:outline-none"
        />
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-xs text-[var(--color-reboot-muted)]">
            Tag a week:
            <select
              value={week ?? ""}
              onChange={(e) => setWeek(e.target.value ? Number(e.target.value) : null)}
              className="rounded-lg border border-white/10 bg-[var(--color-reboot-surface-2)] px-2 py-1 text-xs"
            >
              <option value="">None</option>
              {[1, 2, 3, 4, 5, 6, 7].map((w) => (
                <option key={w} value={w}>
                  Week {w}
                </option>
              ))}
            </select>
          </label>
          <span className="text-xs text-[var(--color-reboot-muted)]">
            {body.length}/{MAX}
          </span>
        </div>
        {error && <p className="text-sm text-[var(--color-reboot-danger)]">{error}</p>}
        <div className="flex justify-end">
          <Button type="submit" disabled={pending || !body.trim()}>
            <Send className="h-4 w-4" aria-hidden />
            {pending ? "Posting…" : "Post"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
