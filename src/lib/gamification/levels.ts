/**
 * Simple level math: every 500 XP is one level.
 * Level 1 starts at 0 XP, level 2 at 500 XP, and so on.
 */
export const MAX_LEVEL = 15;

export function levelForXp(xp: number): number {
  if (xp < 0) return 0;
  return Math.min(MAX_LEVEL, Math.floor(xp / 500) + 1);
}

export function xpForLevel(level: number): number {
  return Math.max(0, (level - 1) * 500);
}

export function xpProgressInLevel(xp: number): {
  level: number;
  currentLevelFloor: number;
  nextLevelFloor: number;
  percent: number;
} {
  const level = levelForXp(xp);
  const currentLevelFloor = xpForLevel(level);
  const nextLevelFloor = xpForLevel(level + 1);
  const span = nextLevelFloor - currentLevelFloor;
  const within = xp - currentLevelFloor;
  const percent = span === 0 ? 100 : Math.max(0, Math.min(100, Math.round((within / span) * 100)));
  return { level, currentLevelFloor, nextLevelFloor, percent };
}
