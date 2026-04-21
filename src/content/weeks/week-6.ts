import type { Week } from "../types";

const week6: Week = {
  number: 6,
  slug: "relationships-build-or-break",
  title: "Relationships That Build You or Break You",
  subtitle: "How to Recognise Healthy and Toxic Connections — and Build the Ones That Make You Better",
  accentColor: "neon",
  neuroscienceHook:
    "Neuroscientists have found that social pain — rejection, exclusion, loneliness — activates the same brain regions as physical pain. Being left out literally hurts in the same way a physical injury does. That's not weakness. That's your wiring. You were built for connection: Genesis 2:18 says it is not good for humans to be alone, and that's before sin enters the picture. Loneliness isn't a consequence of the fall — it's a design feature.",
  verses: [
    {
      reference: "Proverbs 27:17",
      text: "As iron sharpens iron, so one person sharpens another.",
      translation: "NIV",
    },
    {
      reference: "Proverbs 4:23",
      text: "Above all else, guard your heart, for everything you do flows from it.",
      translation: "NIV",
    },
  ],
  pullQuote: "You become who you do life with. Choose those people with your eyes open.",
  practices: [
    "Inner Circle — 2 or 3 people who know the real (2am, struggling) you.",
    "Wider Circle — good friends, youth group, teammates. Real, not always deep.",
    "Outer Circle — kindness and respect, but no inner-world access. That's wisdom, not coldness.",
    "After time with someone, ask: do I feel more like myself or less? That feeling is data.",
  ],
  culturalNote:
    "Ubuntu says 'I am because we are.' But this only works if the 'we' is healthy. A community that pulls you toward destructive patterns, shame, or smallness is not Ubuntu — it is a counterfeit. The real spirit of Ubuntu points toward mutual flourishing and each person becoming more fully themselves.",
  discussionQuestions: [
    "Think about your inner circle right now. Do those people make it easier or harder to be the person you want to be? Is there an honest conversation you need to have — either with yourself or with someone in that circle?",
    "The chapter names three toxic patterns specific to South African youth: substance pressure, unhealthy dating dynamics, and the loyalty trap. Which one do you think is most present in your school or community? How can you protect yourself against it without isolating yourself?",
    "The Ubuntu principle says 'I am because we are.' What would a genuinely Ubuntu inner circle look like — one where every person in it is becoming more fully themselves because of the others?",
  ],
  resetChallenge:
    "Write down the names of your two or three closest people. For each one, answer honestly: Do I feel more like myself after spending time with them, or less? If the answer is 'less' for anyone — just sit with that honestly this week. You don't have to act on it yet. But stop pretending it isn't true.",
  journalPrompt:
    "Describe what your ideal inner circle would look like — not specific people, but the qualities. What would they bring out in you? What would you bring out in them? Now write honestly: how close are you to that right now? What's one thing you could do to move in that direction?",
  contextualAlerts: [
    {
      severity: "danger",
      title: "If a relationship is hurting you",
      body: "If a relationship involves physical harm, sexual pressure, ongoing verbal abuse, or threats — that is not just toxic, it is dangerous. Please tell a trusted adult immediately. This is not something to manage quietly on your own.",
      linkToSupport: true,
    },
  ],
  dailyQuests: [
    {
      day: 1,
      title: "Day 1: Name Your Two or Three",
      instructions:
        "Write down the names of your two or three closest people — the inner circle. Keep it private. This list is just for you.",
      kind: "reflection",
      xpReward: 25,
    },
    ...Array.from({ length: 6 }, (_, i) => ({
      day: (i + 2) as 2 | 3 | 4 | 5 | 6 | 7,
      title: `Day ${i + 2}: The Honest Read`,
      instructions:
        "Think about the time you spent with anyone from your inner circle today (or most recently). Ask: did I feel more like myself, or less? One sentence. No editing. That feeling is data.",
      kind: "observation" as const,
      xpReward: 25,
    })),
  ],
};

export default week6;
