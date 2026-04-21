import type { Week } from "../types";

const week4: Week = {
  number: 4,
  slug: "pressure-stress-grounded",
  title: "Pressure, Stress, and How to Stay Grounded",
  subtitle: "What Stress Actually Does to Your Body — and the Tools to Handle It",
  accentColor: "violet",
  neuroscienceHook:
    "Your amygdala can't tell the difference between a lion in the bushes and a group of people laughing at you — both feel like survival. Adrenaline and cortisol flood your body, your digestion slows, your thinking narrows, and you enter fight/flight/freeze. Stress itself isn't the enemy — chronic unmanaged stress with no recovery is. Research by Matthew Lieberman shows simply putting your stress into words reduces amygdala activity almost immediately.",
  verses: [
    {
      reference: "Psalm 1:3",
      text: "He is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither — whatever they do prospers.",
      translation: "NIV",
    },
    {
      reference: "Philippians 4:6-7",
      text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
      translation: "NIV",
    },
  ],
  pullQuote:
    "You can't control everything that comes at you. But you can decide how deeply you're rooted — and roots are built before the storm, not during it.",
  practices: [
    "Box breathing — 4 in, 4 hold, 4 out, 4 hold, × 4 rounds.",
    "Name what you're carrying — speak it or write it, don't fix it.",
    "Use your body — walk, run, dance, street soccer, kasi-style push-ups.",
    "Loadshedding grounding — name 3 things you see, 3 you hear, 3 you feel.",
    "Guard your sleep — 8–9 hours, no screens 30 min before bed.",
    "Limit the noise — set social media time limits; stress drops within 48 hours.",
    "Stay connected — face-to-face contact releases oxytocin, counteracts cortisol.",
    "Bring it to God specifically — the real thing, not a vague hand-off.",
  ],
  culturalNote:
    "Loadshedding isn't just an inconvenience — it's a chronic stressor on the nervous system. Chronic unpredictability is a real load, and it's worth naming honestly. Northern Cape teens: you were not imagining it.",
  discussionQuestions: [
    "Of the three stages of stress — good stress, acute stress, and chronic stress — which one do you think most describes your life right now? What's the main source of that stress?",
    "The chapter specifically names loadshedding as a chronic stressor unique to South African life. What other pressures do you face that most outside resources don't acknowledge? How does it feel to have those named honestly?",
    "The chapter says the deepest form of stress relief is 'a settled conviction that you are held.' What would it take for you to genuinely believe that — not just as a theological idea, but as something that actually changes how you feel in your body when pressure hits?",
  ],
  resetChallenge:
    "Choose ONE tool from this chapter that you haven't been using. Practise it every day this week at the same time. Keep it simple and consistent. At the end of the week, be honest: did it help?",
  journalPrompt:
    "Write honestly about what 'staying grounded' looks like for you right now. Are your roots deep enough? What one thing — practical, relational, or spiritual — would help you go deeper this season? Write a short prayer asking God to help you plant yourself more firmly in Him.",
  contextualAlerts: [
    {
      severity: "warning",
      title: "If your stress never seems to lift",
      body: "If you recognise yourself in Stage 3 — ongoing, unrelenting stress that never seems to lift — please talk to a trusted adult, a pastor, or a counsellor. Chronic stress needs more than coping tools. It needs real support. There is no shame in asking for help. It is the wisest thing you can do.",
      linkToSupport: true,
    },
  ],
  dailyQuests: Array.from({ length: 7 }, (_, i) => ({
    day: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
    title: `Day ${i + 1}: Box Breath (4-4-4-4)`,
    instructions:
      "Pick your tool for this week. Today's default is box breathing: breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Four rounds. This is not just relaxation advice — it's neuroscience. Your breath is one of the few things connected to both voluntary and involuntary nervous systems.",
    durationSeconds: 120,
    kind: "timer" as const,
    xpReward: 25,
  })),
};

export default week4;
