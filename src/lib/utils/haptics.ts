/**
 * Light wrapper over navigator.vibrate. No-op on desktop.
 */
export function haptic(pattern: number | number[] = 10): void {
  if (typeof navigator === "undefined") return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* not supported, silent */
  }
}

export const hapticSuccess = () => haptic([8, 30, 12]);
export const hapticTick = () => haptic(4);
export const hapticCelebration = () => haptic([12, 40, 24, 40, 32]);
