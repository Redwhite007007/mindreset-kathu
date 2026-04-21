import type { Week } from "../types";

const week1: Week = {
  number: 1,
  slug: "reboot-your-brain",
  title: "Reboot Your Brain",
  subtitle: "Yes, Your Brain Has a Settings Menu",
  accentColor: "electric",
  neuroscienceHook:
    "Your brain runs an algorithm with three background apps — the Alarm System (what matters right now?), the Story App (the default-mode loop that drifts to worst-case), and the Reward System (dopamine hits attached to whatever you engage with, good or bad). When all three team up on negative thoughts, you spin. The same systems that learned the loops can be retrained. That's neuroplasticity — and Scripture calls it the renewing of your mind.",
  verses: [
    {
      reference: "Romans 12:2",
      text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind.",
      translation: "NIV",
    },
    {
      reference: "Philippians 4:8",
      text: "Finally, brothers and sisters, whatever is true, whatever is noble, whatever is right, whatever is pure, whatever is lovely, whatever is admirable — think about such things.",
      translation: "NIV",
    },
  ],
  pullQuote:
    "You are not your thought loops. The anxious voice in your head is not the truest thing about you.",
  practices: [
    "One minute of gratitude, said out loud — go real, not big.",
    "Pause after each item so the dopamine flicker lands.",
    "Repeat for three minutes total.",
  ],
  discussionQuestions: [
    "Think about a thought or worry that has been stuck on repeat in your head lately. Can you describe which 'app' seems to be driving it most — the Alarm System, the Story App, or the Reward System?",
    "When you tried (or imagine trying) the 3-minute gratitude exercise, what felt hard about it? Why do you think it is easier to engage with negative thoughts than grateful ones?",
    "Romans 12:2 talks about being 'transformed by the renewing of your mind.' Based on what you've just read, what do you think that actually looks like in real daily life?",
  ],
  resetChallenge:
    "Every morning this week — before you check your phone — spend three minutes doing the gratitude exercise. Say your gratitude list out loud, even if it feels awkward. Keep a simple tally: how many mornings did you actually do it? Aim for 5 out of 7.",
  journalPrompt:
    "Write about one thought loop that keeps coming back for you. Describe it honestly — what triggers it, what it says, and how it makes you feel. Then write down three things that are genuinely true about your life right now that the loop is ignoring.",
  dailyQuests: Array.from({ length: 7 }, (_, i) => ({
    day: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
    title: `Day ${i + 1}: 3-Minute Reboot`,
    instructions:
      "Before you touch your phone: set a three-minute timer. For the first minute, list things you're grateful for out loud — go real, not big. Pause after each one. Then repeat for two more minutes. That's it.",
    durationSeconds: 180,
    kind: "timer" as const,
    xpReward: 50,
  })),
};

export default week1;
