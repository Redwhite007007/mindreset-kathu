"use client";

import { useState, useTransition } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { reportPost } from "@/lib/community/actions";
import { REPORT_REASONS } from "@/lib/community/types";

export function ReportDialog({ postId }: { postId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>(REPORT_REASONS[0]!.id);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const label = REPORT_REASONS.find((r) => r.id === reason)?.label ?? reason;
      const payload = note.trim() ? `${label}: ${note.trim()}` : label;
      const r = await reportPost(postId, payload);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setDone(true);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-danger)]"
      >
        <Flag className="h-3.5 w-3.5" aria-hidden /> Report
      </button>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
        >
          <div className="w-full max-w-md space-y-3 rounded-[22px] border border-white/10 bg-[var(--color-reboot-surface)] p-5 shadow-2xl">
            <h3 className="text-lg font-bold">Report this post</h3>
            {done ? (
              <>
                <p className="text-sm text-[var(--color-reboot-muted)]">
                  Thank you. A leader will review this. If someone is in immediate danger,
                  please also call Childline 0800 055 555 or SADAG 0800 567 567.
                </p>
                <div className="flex justify-end">
                  <Button onClick={() => setOpen(false)}>Close</Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-[var(--color-reboot-muted)]">
                  Tell a leader what you&apos;re seeing. Reports are private — the author
                  won&apos;t know who reported.
                </p>
                <fieldset className="space-y-2">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r.id}
                      className="flex cursor-pointer items-start gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={r.id}
                        checked={reason === r.id}
                        onChange={() => setReason(r.id)}
                        className="mt-1 accent-[var(--color-reboot-electric)]"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </fieldset>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 500))}
                  rows={3}
                  placeholder="Optional: anything else a leader should know"
                  className="block w-full rounded-2xl border border-white/10 bg-[var(--color-reboot-surface-2)] p-3 text-sm"
                />
                {error && <p className="text-sm text-[var(--color-reboot-danger)]">{error}</p>}
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submit} disabled={pending} variant="danger">
                    <Flag className="h-4 w-4" aria-hidden /> Report
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
