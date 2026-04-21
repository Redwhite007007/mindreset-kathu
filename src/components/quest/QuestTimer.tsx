"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { useQuestTimer } from "@/hooks/useQuestTimer";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function QuestTimer({
  durationSeconds,
  onComplete,
}: {
  durationSeconds: number;
  onComplete?: () => void;
}) {
  const t = useQuestTimer(durationSeconds);

  if (t.done && onComplete) onComplete();

  const pct = Math.round(((t.total - t.remaining) / t.total) * 100);

  return (
    <div className="rounded-[22px] border border-white/5 bg-[var(--color-reboot-surface)] p-5">
      <div className="flex flex-col items-center gap-4">
        <div
          className="text-6xl font-black tracking-tight tabular-nums"
          aria-live="polite"
        >
          {fmt(t.remaining)}
        </div>
        <Progress value={pct} />
        <div className="flex gap-2">
          {!t.running ? (
            <Button onClick={t.start} size="lg">
              <Play className="h-4 w-4" aria-hidden /> {t.done ? "Restart" : "Start"}
            </Button>
          ) : (
            <Button onClick={t.pause} size="lg" variant="secondary">
              <Pause className="h-4 w-4" aria-hidden /> Pause
            </Button>
          )}
          <Button onClick={t.reset} size="lg" variant="ghost" aria-label="Reset timer">
            <RotateCcw className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
