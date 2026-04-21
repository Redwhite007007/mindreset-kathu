"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { DayNumber, WeekNumber } from "@/content/types";
import { getWeek } from "@/content/weeks";
import { useLocalState } from "@/hooks/useLocalState";
import { completeQuestLocal } from "@/lib/offline/local-store";
import { QuestHeader } from "./QuestHeader";
import { QuestTimer } from "./QuestTimer";
import { QuestInstructions } from "./QuestInstructions";
import { QuestNeuroscienceCard } from "./QuestNeuroscienceCard";
import { QuestScriptureCard } from "./QuestScriptureCard";
import { QuestCompleteSheet } from "./QuestCompleteSheet";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

function findNext(weekNumber: number, day: number): { week: number; day: number } | null {
  const w = getWeek(weekNumber as WeekNumber);
  const nextInWeek = w.dailyQuests.find((q) => q.day > day);
  if (nextInWeek) return { week: weekNumber, day: nextInWeek.day };
  if (weekNumber < 7) {
    const next = getWeek((weekNumber + 1) as WeekNumber);
    return { week: next.number, day: next.dailyQuests[0]!.day };
  }
  return null;
}

export function QuestRunner({
  weekNumber,
  day,
}: {
  weekNumber: WeekNumber;
  day: DayNumber;
}) {
  const week = getWeek(weekNumber);
  const quest = week.dailyQuests.find((q) => q.day === day)!;
  const state = useLocalState();
  const alreadyDone = Boolean(state.completions[weekNumber]?.[day]);

  const [sheet, setSheet] = useState<{
    open: boolean;
    awardedXp: number;
    streak: number;
    newBadges: string[];
  }>({ open: false, awardedXp: 0, streak: state.currentStreak, newBadges: [] });

  const onComplete = () => {
    const r = completeQuestLocal(weekNumber, day, quest.durationSeconds);
    setSheet({
      open: true,
      awardedXp: r.awardedXp,
      streak: r.currentStreak,
      newBadges: r.newBadges,
    });
  };

  const next = findNext(weekNumber, day);

  return (
    <div className="space-y-5">
      <QuestHeader week={week} quest={quest} />

      {week.contextualAlerts?.map((a, i) => (
        <Alert key={i} severity={a.severity} title={a.title} linkToSupport={a.linkToSupport}>
          {a.body}
        </Alert>
      ))}

      <QuestInstructions quest={quest} />

      {quest.durationSeconds ? (
        <QuestTimer durationSeconds={quest.durationSeconds} />
      ) : null}

      <QuestNeuroscienceCard week={week} />
      <QuestScriptureCard verses={week.verses} />

      <div className="sticky bottom-24 z-20">
        <Button
          size="lg"
          onClick={onComplete}
          disabled={alreadyDone}
          className="w-full"
        >
          <Check className="h-5 w-5" aria-hidden />
          {alreadyDone ? "Already logged today" : "Mark quest complete"}
        </Button>
      </div>

      <QuestCompleteSheet
        open={sheet.open}
        awardedXp={sheet.awardedXp}
        currentStreak={sheet.streak}
        newBadges={sheet.newBadges}
        weekNumber={weekNumber}
        dayNumber={day}
        nextWeek={next?.week ?? null}
        nextDay={next?.day ?? null}
        onClose={() => setSheet((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
