"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Mic,
  Camera,
  X,
  Play,
  Square,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { addJournalLocal } from "@/lib/offline/local-store";
import { hapticSuccess } from "@/lib/utils/haptics";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { XP_VOICE_JOURNAL_BONUS, XP_PER_JOURNAL } from "@/lib/gamification/xp";

const MOOD_OPTIONS = ["😊", "😌", "😐", "😔", "😤", "😰", "🙏", "🔥"] as const;
const MAX_VOICE_SECONDS = 120;
const MAX_PHOTO_BYTES = 3 * 1024 * 1024; // 3MB after resize

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

async function compressImageToDataUrl(file: File, maxDim = 1280): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas unsupported"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      URL.revokeObjectURL(url);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

export function JournalEditor({
  weekNumber,
  dayNumber,
  prompt,
}: {
  weekNumber?: number;
  dayNumber?: number;
  prompt?: string;
}) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const voice = useVoiceRecorder(MAX_VOICE_SECONDS);

  const hasVoice = voice.status === "stopped" && voice.dataUrl;

  const onPickPhoto = async (file: File) => {
    setPhotoError(null);
    if (!file.type.startsWith("image/")) {
      setPhotoError("That doesn't look like a photo.");
      return;
    }
    try {
      const dataUrl = await compressImageToDataUrl(file);
      if (dataUrl.length > MAX_PHOTO_BYTES * 1.4) {
        setPhotoError("Photo is too large even after compression. Try a smaller one.");
        return;
      }
      setPhoto(dataUrl);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : "Couldn't process that image.");
    }
  };

  const onSave = () => {
    if (!body.trim() && !hasVoice && !photo) return;
    startTransition(() => {
      addJournalLocal({
        body: body.trim(),
        moodEmoji: mood ?? undefined,
        weekNumber,
        dayNumber,
        voiceDataUrl: hasVoice ? voice.dataUrl ?? undefined : undefined,
        voiceDurationSeconds: hasVoice ? voice.durationSeconds : undefined,
        photoDataUrl: photo ?? undefined,
      });
      hapticSuccess();
      setBody("");
      setMood(null);
      setPhoto(null);
      voice.reset();
      router.push("/journal");
    });
  };

  return (
    <Card className="space-y-4">
      <div>
        <CardTitle>Private journal</CardTitle>
        <p className="mt-1 text-xs text-[var(--color-reboot-muted)]">
          Stored on this device only. No leader can read this.
        </p>
      </div>

      {prompt && (
        <div className="rounded-2xl border border-[var(--color-reboot-electric)]/30 bg-[var(--color-reboot-electric)]/10 p-3 text-sm italic text-[var(--color-reboot-text)]/90">
          {prompt}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
          How does today feel?
        </p>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m === mood ? null : m)}
              aria-pressed={mood === m}
              className={`grid h-10 w-10 place-items-center rounded-xl border text-xl transition ${
                mood === m
                  ? "border-[var(--color-reboot-electric)] bg-[var(--color-reboot-electric)]/10"
                  : "border-white/10 bg-[var(--color-reboot-surface-2)] hover:border-white/20"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
          What&apos;s on your mind?
        </span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          placeholder="Start typing. Nothing leaves this device."
          className="block w-full rounded-2xl border border-white/10 bg-[var(--color-reboot-surface-2)] p-3 text-sm leading-relaxed text-[var(--color-reboot-text)] placeholder:text-[var(--color-reboot-muted)] focus:border-[var(--color-reboot-electric)] focus:outline-none"
        />
      </label>

      {/* Voice recorder */}
      <div className="rounded-2xl border border-white/10 bg-[var(--color-reboot-surface-2)] p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Voice note
            </p>
            <p className="text-xs text-[var(--color-reboot-muted)]">
              Speak for up to {Math.round(MAX_VOICE_SECONDS / 60)} min · +{XP_VOICE_JOURNAL_BONUS} XP bonus
            </p>
          </div>
          {voice.status === "recording" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-reboot-danger)]/20 px-2 py-0.5 text-xs font-bold text-[var(--color-reboot-danger)]">
              ● REC {fmtTime(voice.durationSeconds)}
            </span>
          )}
          {hasVoice && (
            <span className="text-xs text-[var(--color-reboot-muted)]">
              {fmtTime(voice.durationSeconds)} saved
            </span>
          )}
        </div>

        {voice.status === "unsupported" ? (
          <p className="mt-2 text-xs text-[var(--color-reboot-muted)]">
            Your browser doesn&apos;t support voice recording. Try Chrome or Safari.
          </p>
        ) : voice.status === "denied" ? (
          <p className="mt-2 text-xs text-[var(--color-reboot-danger)]">
            Mic access denied. Enable it in your browser settings to record.
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          {voice.status !== "recording" && !hasVoice && (
            <Button size="sm" variant="secondary" onClick={() => voice.start()}>
              <Mic className="h-4 w-4" aria-hidden /> Record
            </Button>
          )}
          {voice.status === "recording" && (
            <Button size="sm" variant="danger" onClick={voice.stop}>
              <Square className="h-4 w-4" aria-hidden /> Stop
            </Button>
          )}
          {hasVoice && voice.dataUrl && (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  if (!audioEl) {
                    const a = new Audio(voice.dataUrl!);
                    setAudioEl(a);
                    a.play();
                  } else {
                    audioEl.currentTime = 0;
                    audioEl.play();
                  }
                }}
              >
                <Play className="h-4 w-4" aria-hidden /> Play
              </Button>
              <Button size="sm" variant="ghost" onClick={voice.reset}>
                <RotateCcw className="h-4 w-4" aria-hidden /> Re-record
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Photo */}
      <div className="rounded-2xl border border-white/10 bg-[var(--color-reboot-surface-2)] p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Photo
            </p>
            <p className="text-xs text-[var(--color-reboot-muted)]">
              A sky, a verse on your Bible, a moment. Stays on this device.
            </p>
          </div>
          {photo ? (
            <button
              type="button"
              onClick={() => setPhoto(null)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-reboot-muted)] hover:text-[var(--color-reboot-danger)]"
            >
              <X className="h-3.5 w-3.5" aria-hidden /> Remove
            </button>
          ) : null}
        </div>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt="Journal attachment"
            className="mt-3 h-48 w-full rounded-xl object-cover"
          />
        ) : (
          <div className="mt-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onPickPhoto(f);
                e.target.value = "";
              }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" aria-hidden /> Add photo
            </Button>
            {photoError && (
              <p className="mt-1 text-xs text-[var(--color-reboot-danger)]">{photoError}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--color-reboot-muted)]">
          +{XP_PER_JOURNAL}
          {hasVoice ? ` +${XP_VOICE_JOURNAL_BONUS} voice` : ""} XP
        </span>
        <Button
          onClick={onSave}
          disabled={
            (!body.trim() && !hasVoice && !photo) || isPending
          }
        >
          <Save className="h-4 w-4" aria-hidden /> Save privately
        </Button>
      </div>
    </Card>
  );
}
