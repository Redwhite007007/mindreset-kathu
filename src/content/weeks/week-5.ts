import type { Week } from "../types";

const week5: Week = {
  number: 5,
  slug: "no-one-is-watching",
  title: "Who Are You When No-One Is Watching?",
  subtitle: "Identity, Integrity, and Building the Version of Yourself You Actually Want to Become",
  accentColor: "flame",
  neuroscienceHook:
    "Who you are when nobody is watching is not your worst self — it's your real self. And your real self is what your life is actually being built on. You live in the most watched generation in history and have become extremely good at managing how you look. But you can't build a real life on a performance. Eventually the performance cracks. What's underneath determines whether you hold together or fall apart.",
  verses: [
    {
      reference: "Luke 16:10",
      text: "Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.",
      translation: "NIV",
    },
    {
      reference: "Ephesians 5:13",
      text: "Everything exposed by the light becomes visible — and everything that is illuminated becomes a light.",
      translation: "NIV",
    },
    {
      reference: "Colossians 3:17",
      text: "And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus, giving thanks to God the Father through him.",
      translation: "NIV",
    },
  ],
  pullQuote:
    "Character is not what you show the world. It's what you do when the world isn't looking.",
  practices: [
    "Make decisions before you're in the moment — pre-commitment is wisdom, not weakness.",
    "Let your private habits be your standard — that's who you're becoming.",
    "Tell the truth — especially when it costs you.",
    "Choose your inner circle carefully — your brain mirrors the people you're closest to.",
    "Live as though God sees everything — because He does, and loves you anyway.",
  ],
  culturalNote:
    "In a small mining town like Kathu, what you do in private eventually surfaces — communities are interconnected in ways big cities aren't. But more importantly: your private character is your public testimony, whether you plan it that way or not.",
  discussionQuestions: [
    "Which of the four gaps — Approval, Shame, Convenience, or Faith — hits closest to home for you right now? What does it look like in practice in your daily life?",
    "The chapter says integrity comes from identity — knowing who you already are in Christ — not from trying harder to behave better. How does that change the way you think about character? Does it feel like freedom or does it feel hard to believe?",
    "Joseph maintained his character even when it cost him. Can you think of a time when doing the right thing privately cost you something? What did it produce in you over time?",
  ],
  resetChallenge:
    "Choose one area of your private life where your behaviour doesn't yet match who you want to be. Make one specific decision in advance about how you'll act differently this week — and keep it between you and God. No need to announce it. Just do it. See what it builds.",
  journalPrompt:
    "Write honestly about the gap between your public self and your private self. Don't be harsh on yourself — just be honest. What is one specific thing you could do privately this week that would close that gap slightly? Write it as a commitment.",
  dailyQuests: [
    {
      day: 1,
      title: "Day 1: Name the Gap",
      instructions:
        "Pick one area of your private life where your behaviour doesn't yet match who you want to be. Write it down somewhere private. Don't post it. Don't tell anyone. Just name it.",
      kind: "reflection",
      xpReward: 25,
    },
    ...Array.from({ length: 6 }, (_, i) => ({
      day: (i + 2) as 2 | 3 | 4 | 5 | 6 | 7,
      title: `Day ${i + 2}: Private Follow-Through`,
      instructions:
        "Come back to the decision you made on Day 1. Did you keep it today? No shame if not — just notice. Then re-commit for the next 24 hours. Small. Private. Between you and God.",
      kind: "action" as const,
      xpReward: 25,
    })),
  ],
};

export default week5;
