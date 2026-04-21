import type { Week } from "../types";

const week7: Week = {
  number: 7,
  slug: "purpose",
  title: "Purpose: Why You're Here and Where You're Going",
  subtitle: "How to Find Direction When the Future Feels Unclear",
  accentColor: "violet",
  neuroscienceHook:
    "The Greek word for 'handiwork' in Ephesians 2:10 is poiema — the word we get 'poem' from. You are not a product off an assembly line. You are a crafted work. Purpose is not a needle in a haystack — it is a direction, developed over a lifetime through faithfulness, curiosity, and obedience. Clarity usually comes through movement, not before it.",
  verses: [
    {
      reference: "Jeremiah 29:11",
      text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
      translation: "NIV",
    },
    {
      reference: "Ephesians 2:10",
      text: "For we are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.",
      translation: "NIV",
    },
    {
      reference: "Jeremiah 1:5",
      text: "Before I formed you in the womb I knew you, before you were born I set you apart.",
      translation: "NIV",
    },
    {
      reference: "Matthew 25:21",
      text: "Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things.",
      translation: "NIV",
    },
  ],
  pullQuote:
    "You are not here by accident. You are not here without purpose. You are here on purpose — for a purpose — by a God who has never once lost track of you.",
  practices: [
    "Clue #1 — What makes you come alive? (Lose-track-of-time activities, conversations that make you forget your phone.)",
    "Clue #2 — What are you naturally good at? (What do others consistently come to you for?)",
    "Clue #3 — What has God already redeemed in your story? (Wounds as raw material, not liabilities.)",
    "Clue #4 — What breaks your heart about the world? (Compassion as divine nudge.)",
  ],
  culturalNote:
    "God's purpose for you is not cancelled by slow economic growth, limited opportunities, or a difficult job market. Your gifts — academic, creative, entrepreneurial, practical, relational, serving — can bless your family, community, and nation in ways that cannot be stopped by an unemployment rate. Young South Africans are already living this out. The question is whether you'll do the inner work to show up ready.",
  discussionQuestions: [
    "Which of the five purpose myths hit closest to home for you? Has one of them been holding you back from taking a next step? What would it look like to let go of that myth?",
    "The four clues — what makes you come alive, what you're good at, what God has redeemed in your story, and what breaks your heart — which one speaks most clearly to you right now? What is it pointing toward?",
    "The chapter says 'clarity usually comes through movement, not before it.' Is there a next faithful step you've been waiting to feel more certain about before you take it? What would it look like to take that step anyway?",
  ],
  resetChallenge:
    "Do one thing this week that moves you toward something you feel called to. It can be small: have a conversation with someone doing work you admire, volunteer for one thing at church or in your community, research a subject that lights you up, or simply write down your four clues and look at what patterns emerge. Movement before certainty.",
  journalPrompt:
    "Write your own answer to the Central Question: 'Why did God make me, and what does He want to do through my specific life?' Don't worry about getting it perfect — just write honestly. What are the clues you already have? What faithful step is right in front of you that you've been putting off? End with a short prayer committing that step to God.",
  dailyQuests: [
    {
      day: 1,
      title: "Day 1: Pick Your Faithful Step",
      instructions:
        "Write down one thing you could do this week that moves you toward something you feel called to. Small is fine. A conversation, an email, one piece of research. Movement before certainty.",
      kind: "reflection",
      xpReward: 25,
    },
    ...Array.from({ length: 5 }, (_, i) => ({
      day: (i + 2) as 2 | 3 | 4 | 5 | 6,
      title: `Day ${i + 2}: Move`,
      instructions:
        "Check in on the step you wrote down on Day 1. Did you take it — or any piece of it — today? If yes, note what happened. If no, what's the smallest next move you can make in the next 24 hours?",
      kind: "action" as const,
      xpReward: 25,
    })),
    {
      day: 7,
      title: "Day 7: Your Journey Summary",
      instructions:
        "You made it. Seven weeks. Before you close this one out, answer three questions honestly: Which chapter changed the way you think the most? Which challenge was hardest — and why? What one thing has genuinely shifted in you over these 7 weeks?",
      kind: "reflection",
      xpReward: 25,
    },
  ],
};

export default week7;
