import type { Badge } from "./types";

/**
 * Badge catalogue. Must match supabase/migrations/0004_badges_seed.sql exactly.
 */
export const BADGES: readonly Badge[] = [
  { id: "first-reset", name: "First Reset", description: "You completed your first daily quest. The algorithm starts shifting.", emoji: "🚀", xpReward: 10, sortOrder: 1 },
  { id: "flame-spark", name: "Flame Spark", description: "Two days in a row. The habit is waking up.", emoji: "🔥", xpReward: 5, sortOrder: 10 },
  { id: "flame-steady", name: "Flame Steady", description: "Three-day streak. This is becoming who you are.", emoji: "🔥", xpReward: 10, sortOrder: 11 },
  { id: "flame-blaze", name: "Blaze", description: "Seven days straight. Your brain is re-wiring itself.", emoji: "🔥", xpReward: 25, sortOrder: 12 },
  { id: "flame-inferno", name: "Inferno", description: "Fourteen days. You've built a rhythm most adults wish they had.", emoji: "🔥", xpReward: 50, sortOrder: 13 },
  { id: "week-1-done", name: "Rebooted", description: "You finished Week 1 — Reboot Your Brain.", emoji: "🧠", xpReward: 50, sortOrder: 21 },
  { id: "week-2-done", name: "Feels Fluent", description: "You finished Week 2 — Why Your Emotions Aren't the Enemy.", emoji: "💙", xpReward: 50, sortOrder: 22 },
  { id: "week-3-done", name: "Word Warrior", description: "You finished Week 3 — The Words You Speak Over Yourself.", emoji: "🗣️", xpReward: 50, sortOrder: 23 },
  { id: "week-4-done", name: "Rooted", description: "You finished Week 4 — Pressure, Stress, and How to Stay Grounded.", emoji: "🌳", xpReward: 50, sortOrder: 24 },
  { id: "week-5-done", name: "Unseen Faithful", description: "You finished Week 5 — Who Are You When No-One Is Watching?", emoji: "🕯️", xpReward: 50, sortOrder: 25 },
  { id: "week-6-done", name: "Iron Sharpener", description: "You finished Week 6 — Relationships That Build You or Break You.", emoji: "⚔️", xpReward: 50, sortOrder: 26 },
  { id: "week-7-done", name: "Purposeful", description: "You finished Week 7 — Purpose: Why You're Here and Where You're Going.", emoji: "🎯", xpReward: 50, sortOrder: 27 },
  { id: "reset-complete", name: "Reset Complete", description: "All 7 weeks. You showed up. Something genuinely shifted.", emoji: "👑", xpReward: 300, sortOrder: 30 },
  { id: "scribe", name: "Scribe", description: "Ten journal entries. Your honest words are doing something.", emoji: "📓", xpReward: 30, sortOrder: 40 },
] as const;

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
