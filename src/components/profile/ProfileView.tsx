"use client";

import { useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { useLocalState } from "@/hooks/useLocalState";
import { resetLocalState, updateProfileLocal } from "@/lib/offline/local-store";
import { BadgeGrid } from "@/components/gamification/BadgeGrid";
import { LevelBadge } from "@/components/gamification/LevelBadge";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { flameTier, flameEmoji } from "@/lib/gamification/streak";
import { seriesPercent } from "@/lib/quests/today";

const EMOJI_OPTIONS = ["🔥", "🧠", "⚡", "🌱", "🦁", "🦅", "🌟", "🎯"] as const;

export function ProfileView() {
  const state = useLocalState();
  const [editing, setEditing] = useState(false);
  const [handle, setHandle] = useState(state.handle);

  const save = () => {
    updateProfileLocal({ handle: handle.trim() || state.handle });
    setEditing(false);
  };

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Change avatar emoji"
            className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--color-reboot-surface-2)] text-3xl"
            onClick={() => {
              const next = EMOJI_OPTIONS[
                (EMOJI_OPTIONS.indexOf(state.avatarEmoji as (typeof EMOJI_OPTIONS)[number]) + 1) %
                  EMOJI_OPTIONS.length
              ];
              updateProfileLocal({ avatarEmoji: next });
            }}
          >
            {state.avatarEmoji}
          </button>
          <div className="flex-1">
            {editing ? (
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[var(--color-reboot-surface-2)] px-3 py-1.5 text-lg font-bold"
                maxLength={30}
                autoFocus
              />
            ) : (
              <CardTitle>{state.handle}</CardTitle>
            )}
            <div className="mt-1 flex items-center gap-2">
              <LevelBadge xp={state.totalXp} />
              <span className="text-xs text-[var(--color-reboot-muted)]">
                {state.totalXp} XP · {seriesPercent(state.completions)}% series
              </span>
            </div>
          </div>
          {editing ? (
            <Button size="sm" onClick={save}>
              Save
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Current
            </div>
            <div className="text-2xl font-black">
              {state.currentStreak} {flameEmoji(flameTier(state.currentStreak))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Longest
            </div>
            <div className="text-2xl font-black">{state.longestStreak}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
              Journal
            </div>
            <div className="text-2xl font-black">{state.journal.length}</div>
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <CardTitle>Push reminders</CardTitle>
        <p className="text-xs text-[var(--color-reboot-muted)]">
          Gentle, local nudges. Never from pastors, never shaming. You can switch them off any time.
        </p>
        <label className="flex items-center justify-between text-sm">
          <span>Morning reboot (8:00 SAST)</span>
          <input
            type="checkbox"
            checked={state.morningPushEnabled}
            onChange={(e) => updateProfileLocal({ morningPushEnabled: e.target.checked })}
            className="h-5 w-5 accent-[var(--color-reboot-electric)]"
          />
        </label>
        <label className="flex items-center justify-between text-sm">
          <span>Evening reflection (20:00 SAST)</span>
          <input
            type="checkbox"
            checked={state.eveningPushEnabled}
            onChange={(e) => updateProfileLocal({ eveningPushEnabled: e.target.checked })}
            className="h-5 w-5 accent-[var(--color-reboot-electric)]"
          />
        </label>
      </Card>

      <BadgeGrid earned={state.badges} />

      <Card className="space-y-3">
        <CardTitle>Danger zone</CardTitle>
        <p className="text-xs text-[var(--color-reboot-muted)]">
          Resetting clears XP, streak, badges, and journal entries on this device only. This cannot be undone.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            onClick={() => {
              if (confirm("Reset all local progress? This cannot be undone.")) {
                resetLocalState();
              }
            }}
          >
            <RefreshCw className="h-4 w-4" aria-hidden /> Reset local progress
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              // Placeholder for Supabase sign-out in Gate 5.
              if (confirm("Sign out? (Local progress stays on this device.)")) {
                window.location.href = "/sign-in";
              }
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </Button>
        </div>
      </Card>
    </div>
  );
}
