import { daysBetween, sastDateString } from "../utils/date";

export type FlameTier = "none" | "spark" | "steady" | "blaze" | "inferno";

export function flameTier(streak: number): FlameTier {
  if (streak >= 14) return "inferno";
  if (streak >= 7) return "blaze";
  if (streak >= 3) return "steady";
  if (streak >= 1) return "spark";
  return "none";
}

export function flameEmoji(tier: FlameTier): string {
  switch (tier) {
    case "inferno":
      return "🔥🔥🔥🔥";
    case "blaze":
      return "🔥🔥🔥";
    case "steady":
      return "🔥🔥";
    case "spark":
      return "🔥";
    default:
      return "·";
  }
}

/**
 * Pure streak update. Given the last completion date (SAST) and the current
 * streak, return the new streak after completing a quest today.
 */
export function nextStreak(
  currentStreak: number,
  lastCompletedOn: string | null,
  todaySast = sastDateString(),
): number {
  if (!lastCompletedOn) return 1;
  const delta = daysBetween(lastCompletedOn, todaySast);
  if (delta <= 0) return Math.max(currentStreak, 1); // same day, no change
  if (delta === 1) return currentStreak + 1;
  return 1; // gap — reset
}
