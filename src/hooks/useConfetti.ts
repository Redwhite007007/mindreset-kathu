"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";
import { hapticCelebration } from "@/lib/utils/haptics";

export function useConfetti() {
  return useCallback(() => {
    hapticCelebration();
    const end = Date.now() + 800;
    const colors = ["#3B82F6", "#22D3A8", "#F97316", "#FB7185", "#A78BFA"];
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.9 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.9 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);
}
