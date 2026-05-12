"use client";

import { useMemo } from "react";
import { useLeagueData } from "@/app/context/LeagueDataContext";

export const useScoreboardData = () => {
  const { gameData } = useLeagueData();

  const allPlayerNames = useMemo(() => {
    const tabs = gameData?.tabs;

    if (!tabs) return [];

    return [
      ...(tabs.Order?.players ?? []),
      ...(tabs.Chaos?.players ?? []),
    ].map((p) => p.playerName);
  }, [gameData?.tabs]);

  return {
    scoreboard: gameData?.scoreboard || null,
    allPlayerNames,
  };
};