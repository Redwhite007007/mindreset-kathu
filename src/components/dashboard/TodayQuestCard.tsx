"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Mic, StopCircle } from "lucide-react";
import { useLocalState } from "@/hooks/useLocalState";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { pickToday } from "@/lib/quests/today";
import { completeQuestLocal } from "@/lib/offline/local-store";
import { Card, CardSubtitle, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function TodayQuestCard() {
  const state = useLocalState();
  const { week, quest } = pickToday(state.completions);
  const alreadyDone = Boolean(state.completions[week.number]?.[quest.day]);

  const totalSeconds = quest.durationSeconds || 180;
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [gratitudes, setGratitudes] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const voice = useVoiceRecorder(60);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) {
      setIsActive(false);
      return;
    }
    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(id);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (!showCelebration) return;
    const timeout = window.setTimeout(() => setShowCelebration(false), 2500);
    return () => window.clearTimeout(timeout);
  }, [showCelebration]);

  const progressPercent = useMemo(
    () => Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100),
    [totalSeconds, timeLeft],
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (alreadyDone) return;
    setIsActive(true);
    setTimeLeft(totalSeconds);
    setCompletionMessage(null);
  };

  const toggleRecording = async () => {
    if (voice.status === "recording") {
      voice.stop();
      return;
    }
    await voice.start();
  };

  const completeQuest = () => {
    if (alreadyDone) return;
    if (timeLeft > 0) return;

    const result = completeQuestLocal(week.number, quest.day, totalSeconds);
    if (!result.replay) {
      setShowCelebration(true);
      setCompletionMessage(
        `You completed the Reboot Your Brain quest — +${result.awardedXp} XP and streak ${result.currentStreak}!`,
      );
    }
  };

  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (progressPercent / 100) * circumference;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -left-16 -bottom-20 h-56 w-56 rounded-full bg-[var(--color-reboot-neon)]/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardSubtitle className="font-bold uppercase tracking-widest">
              Today&apos;s quest · Week {week.number} · Day {quest.day}
            </CardSubtitle>
            <CardTitle>{quest.title}</CardTitle>
            <p className="mt-1 text-sm text-[var(--color-reboot-muted)]">{week.title}</p>
          </div>
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg viewBox="0 0 160 160" className="h-32 w-32">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                className="text-[var(--color-reboot-surface-2)]"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                className="text-[var(--color-reboot-electric)] transition-all duration-300 ease-out"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-reboot-muted)]">
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm font-semibold text-[var(--color-reboot-text)]">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[var(--color-reboot-text)]/90">
          {quest.instructions}
        </p>

        {alreadyDone ? (
          <div className="rounded-3xl border border-[var(--color-reboot-neon)]/40 bg-[var(--color-reboot-neon)]/10 p-4 text-sm text-[var(--color-reboot-text)]">
            You already completed this reset today. Feel free to revisit the gratitude practice anytime.
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button onClick={startTimer} disabled={isActive} className="w-full">
                {isActive ? "Timer running" : "Start Gratitude Timer"}
              </Button>
              <Button
                onClick={toggleRecording}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                {voice.status === "recording" ? (
                  <>
                    <StopCircle className="h-4 w-4" /> Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" /> Voice note
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-3xl border border-[var(--color-reboot-surface-2)] bg-[var(--color-reboot-surface)] p-4">
              <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.22em] text-[var(--color-reboot-muted)]">
                <span>Gratitude journal</span>
                <span>{gratitudes.trim().split(/\n+/).filter((line) => line.trim()).length} items</span>
              </div>
              <textarea
                placeholder="Write three things you are grateful for in Kathu today — big or small."
                value={gratitudes}
                onChange={(e) => setGratitudes(e.target.value)}
                className="min-h-[140px] w-full resize-none rounded-2xl border border-transparent bg-transparent p-3 text-sm text-[var(--color-reboot-text)] placeholder-[var(--color-reboot-muted)] focus:border-[var(--color-reboot-electric)] focus:outline-none"
              />
              {voice.dataUrl && (
                <div className="mt-4 rounded-2xl bg-[var(--color-reboot-bg)] p-3 text-sm text-[var(--color-reboot-text)]">
                  <div className="flex items-center justify-between gap-3">
                    <span>Recorded gratitude note</span>
                    <span className="text-[var(--color-reboot-muted)]">{voice.durationSeconds}s</span>
                  </div>
                  <audio controls src={voice.dataUrl} className="mt-3 w-full" />
                </div>
              )}
              {voice.error && (
                <div className="mt-4 rounded-2xl bg-[var(--color-reboot-danger)]/10 p-3 text-sm text-[var(--color-reboot-danger)]">
                  {voice.error}
                </div>
              )}
            </div>

            <Button
              onClick={completeQuest}
              disabled={timeLeft > 0 || alreadyDone}
              className="w-full"
            >
              <Check className="h-4 w-4 mr-2" /> Complete Quest (+{quest.xpReward} XP)
            </Button>

            {completionMessage && (
              <div className="rounded-3xl border border-[var(--color-reboot-electric)]/30 bg-[var(--color-reboot-electric)]/10 p-4 text-sm text-[var(--color-reboot-text)]">
                {completionMessage}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-reboot-muted)]">
          <span>XP earned: +{quest.xpReward}</span>
          <span>{alreadyDone ? "Quest complete" : "Finish the timer to complete."}</span>
        </div>
      </div>

      {showCelebration && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse rounded-full bg-[var(--color-reboot-electric)]/10 p-6 text-center text-[var(--color-reboot-text)] shadow-[0_0_40px_rgba(0,240,255,0.35)]">
            <p className="text-2xl">🎉</p>
            <p className="mt-2 text-sm font-bold">Quest complete!</p>
          </div>
        </div>
      )}
      {showCelebration && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-4 top-6 animate-bounce text-2xl">✨</div>
          <div className="absolute right-6 top-10 animate-bounce text-2xl">🎉</div>
          <div className="absolute left-10 bottom-8 animate-bounce text-2xl">💥</div>
          <div className="absolute right-8 bottom-10 animate-bounce text-2xl">🌟</div>
        </div>
      )}
    </Card>
  );
}
