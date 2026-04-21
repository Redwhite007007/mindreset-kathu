import type { Week } from "../types";

const week3: Week = {
  number: 3,
  slug: "words-you-speak-over-yourself",
  title: "The Words You Speak Over Yourself",
  subtitle: "How Your Self-Talk Is Either Building You or Breaking You",
  accentColor: "sunset",
  neuroscienceHook:
    "Every time you repeat a thought about yourself, you reinforce a neural pathway — like a track worn into dirt by a wheel going over it again and again. Neuroscientists call it neuroplasticity. Scripture calls it the renewing of your mind. Same reality, different vocabulary. 'Taking every thought captive' isn't just a spiritual metaphor — it's a description of an actual mental skill you can train.",
  verses: [
    {
      reference: "Proverbs 18:21",
      text: "Death and life are in the power of the tongue.",
      translation: "NIV",
    },
    {
      reference: "2 Corinthians 10:5",
      text: "We demolish arguments and every pretension that sets itself up against the knowledge of God, and we take captive every thought to make it obedient to Christ.",
      translation: "NIV",
    },
    {
      reference: "Philippians 1:6",
      text: "He who began a good work in you will carry it on to completion.",
      translation: "NIV",
    },
  ],
  pullQuote:
    "The voice you rehearse the most becomes the voice you believe the most. Choose carefully.",
  practices: [
    "Catch it — notice the self-talk without judgment.",
    "Check it — Is this actually true? Would I say this to someone I love? What would a wise, kind person say to me?",
    "Challenge it — talk back, out loud if you can.",
    "Replace it with truth — a specific verse that speaks to the specific lie.",
  ],
  discussionQuestions: [
    "Which of the three types of negative self-talk — Mind Reader, Harsh Judge, or Catastrophiser — do you recognise most in your own inner voice? Can you think of a recent example?",
    "The Language Swap table gives honest, non-fake replacements. Why do you think it's important that the replacements are honest rather than blindly positive? What's the difference?",
    "If God's 'I am' statements are actually the truest things ever spoken about you, why is it so hard to believe them over the negative voice? What would it take to shift that?",
  ],
  resetChallenge:
    "Choose one 'I am' statement from the 'What God says you are' box. Write it on a sticky note or in your phone. Say it out loud every morning and every night this week — even if it feels awkward. At the end of the week, notice if anything has shifted in how you carry yourself.",
  journalPrompt:
    "Write down the most common negative 'I am' statement that runs in your head. Where do you think it came from — a person, an event, a repeated experience? Now write out the truth that God speaks over that exact lie. Which one will you choose to practise this week?",
  dailyQuests: Array.from({ length: 7 }, (_, i) => ({
    day: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 | 7,
    title: `Day ${i + 1}: Speak the Truth`,
    instructions:
      "Pick one of these out loud, morning and night: 'I am loved — Jeremiah 31:3.' 'I am chosen — John 15:16.' 'I am enough — 2 Corinthians 12:9.' 'I am not defined by my worst moment — Romans 8:1.' 'I am being made new — Philippians 1:6.' Even if it feels awkward. Especially if it feels awkward.",
    durationSeconds: 60,
    kind: "declaration" as const,
    xpReward: 25,
  })),
};

export default week3;
