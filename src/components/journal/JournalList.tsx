"use client";

import Link from "next/link";
import { useState } from "react";
import { PenLine, Play, Pause, Trash2 } from "lucide-react";
import { useLocalState } from "@/hooks/useLocalState";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatRelative } from "@/lib/utils/date";
import { deleteJournalLocal } from "@/lib/offline/local-store";

function VoicePlayer({ dataUrl, durationSec }: { dataUrl: string; durationSec?: number }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    let a = audio;
    if (!a) {
      a = new Audio(dataUrl);
      a.addEventListener("ended", () => setPlaying(false));
      setAudio(a);
    }
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play();
      setPlaying(true);
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--color-reboot-surface-2)] px-3 py-1 text-xs font-semibold"
    >
      {playing ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
      Voice note{durationSec ? ` · ${durationSec}s` : ""}
    </button>
  );
}

export function JournalList() {
  const state = useLocalState();

  if (state.journal.length === 0) {
    return (
      <Card className="space-y-4 text-center">
        <div className="text-6xl">🌟</div>
        <h2 className="text-xl font-bold text-[var(--color-reboot-electric)]">
          Your gratitude journal awaits
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-reboot-text)]/90">
          Start capturing the bright moments in Kathu. Write down three things you're grateful for each day — it rewires your brain for joy.
        </p>
        <Link href="/journal/new" className="inline-block">
          <Button>
            <PenLine className="h-4 w-4" aria-hidden /> Write your first entry
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {state.journal.map((e) => (
        <li key={e.id}>
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                {e.moodEmoji && (
                  <span aria-hidden className="mr-2 text-xl">
                    {e.moodEmoji}
                  </span>
                )}
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
                  {e.weekNumber && e.dayNumber
                    ? `Week ${e.weekNumber} · Day ${e.dayNumber}`
                    : "Free entry"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-reboot-muted)]">
                  {formatRelative(e.createdAt)}
                </span>
                <button
                  type="button"
                  aria-label="Delete entry"
                  onClick={() => {
                    if (confirm("Delete this entry? This can't be undone.")) {
                      deleteJournalLocal(e.id);
                    }
                  }}
                  className="text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-danger)]"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
            {e.body && (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[var(--color-reboot-text)]/90">
                {e.body}
              </p>
            )}
            {e.photoDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={e.photoDataUrl}
                alt="Journal photo"
                className="mt-2 max-h-64 w-full rounded-xl object-cover"
              />
            )}
            {e.voiceDataUrl && (
              <VoicePlayer dataUrl={e.voiceDataUrl} durationSec={e.voiceDurationSeconds} />
            )}
          </Card>
        </li>
      ))}
    </ul>
  );
}
