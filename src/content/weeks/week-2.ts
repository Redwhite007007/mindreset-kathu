import type { Week } from "../types";

const week2: Week = {
  number: 2,
  slug: "emotions-arent-the-enemy",
  title: "Why Your Emotions Aren't the Enemy",
  subtitle: "And How to Stop Fighting Yourself",
  accentColor: "neon",
  neuroscienceHook:
    "Emotions are information, not weakness. Anger says 'something I care about is threatened'. Sadness says 'I've lost something'. Anxiety says 'my brain has detected a possible threat'. Loneliness says 'I need connection'. Scientists call it affect labelling — the moment you accurately name an emotion, its intensity drops. Your brain shifts from reaction mode to processing mode. You calm down a little just by naming it. Most emotions, when actually felt, pass within 90 seconds to a few minutes.",
  verses: [
    {
      reference: "Ephesians 4:26",
      text: "In your anger do not sin. Do not let the sun go down while you are still angry.",
      translation: "NIV",
    },
    {
      reference: "Psalm 147:3",
      text: "He heals the broken-hearted and binds up their wounds.",
      translation: "NIV",
    },
  ],
  pullQuote:
    "You were never meant to fight yourself. You were meant to know yourself — and then bring that self to God.",
  practices: [
    "Name it specifically — not 'bad', not 'fine'. Angry? Embarrassed? Lonely? Scared?",
    "Refuse to spin it. 'This is a feeling, not a fact. A signal, not a sentence.'",
    "Take it to God unfiltered, David-in-the-Psalms style.",
    "Choose your response — the pause between feeling and acting is where your character lives.",
  ],
  culturalNote:
    "In many South African homes — especially for young men — emotions are dismissed as weakness. But Jesus wept (John 11:35). He was 'deeply troubled in spirit' (John 13:21). He felt anger in the temple (John 2:15). Ubuntu — 'I am because we are' — reminds us we weren't made to feel alone.",
  discussionQuestions: [
    "Which of the three unhealthy responses — spinning, shaming, or stuffing — do you recognise most in yourself? What usually triggers it?",
    "The chapter says emotions are 'information, not weakness.' How does that idea challenge the way you were raised to think about feelings? Is it hard to accept?",
    "David brought raw, unfiltered emotions to God in the Psalms — anger, fear, doubt, despair. What would it look like for you to be that honest with God this week? What would you actually say?",
  ],
  resetChallenge:
    "This week, once a day, pause for 60 seconds and ask: 'What am I actually feeling right now?' Name it specifically — not just 'fine' or 'okay.' Write it down in your phone or a notebook. At the end of the week, look back. What patterns do you notice?",
  journalPrompt:
    "Think about an emotion you've been avoiding, stuffing, or shaming yourself for having. Write it down honestly. What is it actually trying to tell you? What signal is it sending? Now write a short, honest prayer — in your own words — bringing that exact emotion to God.",
  dailyQuests: Array.from({ length: 7 }, (_, i) => ({
    day: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
    title: `Day ${i + 1}: 60-Second Name-It`,
    instructions:
      "Pause. Set a one-minute timer. Ask yourself: what am I actually feeling right now? Be specific — angry, embarrassed, scared, lonely, disappointed. Say it out loud or type it into your phone. Then let it be. You don't have to fix it — you just have to name it.",
    durationSeconds: 60,
    kind: "reflection" as const,
    xpReward: 25,
  })),
};

export default week2;
