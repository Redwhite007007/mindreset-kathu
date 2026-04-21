"use client";

import { useState, useEffect } from "react";
import { loadLocalState, type LocalState } from "@/lib/offline/local-store";

const defaultState: LocalState = {
  version: 1,
  handle: "Kathu Friend",
  avatarEmoji: "🔥",
  createdAt: new Date(0).toISOString(),
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedOn: null,
  completions: {},
  badges: [],
  journal: [],
  morningPushEnabled: true,
  eveningPushEnabled: false,
};

export function useLocalState(): LocalState {
  const [state, setState] = useState<LocalState>(defaultState);

  useEffect(() => {
    setState(loadLocalState());
    const handler = () => {
      setState(loadLocalState());
    };
    window.addEventListener("mindreset:state-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("mindreset:state-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return state;
}
