/**
 * MindReset Kathu — content types
 *
 * All chapter copy is hard-coded in src/content/weeks/*.ts and type-checked
 * against this file. The inventory at docs/content-inventory.md is the spec:
 * any drift between this module and the PDF is a code-review failure.
 */

export type WeekNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type BibleTranslation = "NIV" | "ESV" | "NKJV" | "NLT";

export type Verse = {
  reference: string;
  text: string;
  translation?: BibleTranslation;
};

export type QuestKind =
  | "timer" // e.g. 3-minute gratitude timer
  | "reflection" // 60-second pause and name-it
  | "declaration" // say "I am" out loud
  | "observation" // notice something specific
  | "action"; // do one concrete thing

export type DailyQuest = {
  day: DayNumber;
  title: string;
  instructions: string;
  durationSeconds?: number;
  kind: QuestKind;
  xpReward: number;
};

export type ContextualAlert = {
  severity: "info" | "warning" | "danger";
  title: string;
  body: string;
  linkToSupport: boolean;
};

export type Week = {
  number: WeekNumber;
  slug: string;
  title: string;
  subtitle: string;
  accentColor: "electric" | "neon" | "sunset" | "flame" | "violet";
  neuroscienceHook: string;
  verses: Verse[];
  pullQuote: string;
  practices: string[];
  discussionQuestions: string[];
  resetChallenge: string;
  journalPrompt: string;
  dailyQuests: DailyQuest[];
  culturalNote?: string;
  contextualAlerts?: ContextualAlert[];
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  xpReward: number;
  sortOrder: number;
};
