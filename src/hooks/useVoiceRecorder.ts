"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceState = {
  status: "idle" | "recording" | "stopped" | "denied" | "unsupported";
  durationSeconds: number;
  dataUrl: string | null;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
};

function isSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function" &&
    typeof MediaRecorder !== "undefined"
  );
}

export function useVoiceRecorder(maxSeconds = 120): VoiceState {
  const [status, setStatus] = useState<VoiceState["status"]>("idle");
  const [duration, setDuration] = useState(0);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isSupported()) setStatus("unsupported");
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setDuration(0);
    setDataUrl(null);
    setError(null);
    chunksRef.current = [];
  }, []);

  const stop = useCallback(() => {
    try {
      recorderRef.current?.stop();
    } catch {
      /* noop */
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const start = useCallback(async () => {
    if (!isSupported()) {
      setStatus("unsupported");
      return;
    }
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          setDataUrl(String(reader.result ?? ""));
          setStatus("stopped");
        };
        reader.readAsDataURL(blob);
      };
      recorderRef.current = rec;
      rec.start();
      setStatus("recording");
      setDuration(0);
      tickRef.current = setInterval(() => {
        setDuration((d) => {
          const next = d + 1;
          if (next >= maxSeconds) {
            stop();
          }
          return next;
        });
      }, 1000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Mic access denied";
      setError(msg);
      setStatus("denied");
    }
  }, [maxSeconds, stop]);

  return { status, durationSeconds: duration, dataUrl, error, start, stop, reset };
}
