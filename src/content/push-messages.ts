/**
 * Localised Kathu push copy. Keep the voice warm, direct, and
 * non-religious-cliché — same tone as the PDF.
 */
export const MORNING_PUSH_MESSAGES: readonly string[] = [
  "Howzit — your 3-minute reset is waiting. Before the phone, the reboot 👊",
  "Good morning, Kathu. One minute of gratitude, out loud. Three minutes total. Go 🧠",
  "Before the day gets loud, reset the algorithm. 3 minutes. You've got this 🔥",
  "New day. Same God. Your brain is listening — feed it something true 💙",
  "Loadshedding or not, the reset still works in the dark. Tap in 🕯️",
];

export const EVENING_PUSH_MESSAGES: readonly string[] = [
  "Ten minutes before sleep — what are you actually carrying today? Journal it.",
  "Your brain clears cortisol while you sleep. Let it. Phone down, please 🌙",
  "One honest sentence tonight. That's all. No one else reads it.",
];

export function pickMessage(pool: readonly string[], seed = Date.now()): string {
  return pool[seed % pool.length] ?? pool[0]!;
}
