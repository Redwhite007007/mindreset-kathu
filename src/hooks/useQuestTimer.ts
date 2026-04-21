"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { hapticTick } from "@/lib/utils/haptics";

export type QuestTimerState = {
  remaining: number;
  total: number;
  running: boolean;
  done: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
};

export function useQuestTimer(durationSeconds: number): QuestTimerState {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  useEffect(() => () => clearTick(), []);

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearTick();
          setRunning(false);
          setDone(true);
          hapticTick();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return clearTick;
  }, [running]);

  const start = useCallback(() => {
    if (done) {
      setRemaining(durationSeconds);
      setDone(false);
    }
    setRunning(true);
  }, [done, durationSeconds]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    clearTick();
    setRunning(false);
    setDone(false);
    setRemaining(durationSeconds);
  }, [durationSeconds]);

  return { remaining, total: durationSeconds, running, done, start, pause, reset };
}
