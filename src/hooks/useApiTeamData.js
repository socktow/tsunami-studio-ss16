"use client";

import { useMemo, useState, useEffect } from "react";
import { useLeagueData } from "@/app/context/LeagueDataContext";

export const useScoreboardData = () => {
  const { gameData } = useLeagueData();
  const [currentMatch, setCurrentMatch] = useState(null);

  useEffect(() => {
    const fetchCurrentMatch = async () => {
      try {
        const res = await fetch("/api/current-game");
        const json = await res.json();
        if (json.success) setCurrentMatch(json.data);
      } catch (err) {
        console.error("Failed to fetch current match", err);
      }
    };
    fetchCurrentMatch();
  }, []);

  const allPlayerNames = useMemo(() => {
    const tabs = gameData?.tabs;
    if (!tabs) return [];

    const standardRoles = ["TOP", "JUNGLE", "MID", "ADC", "SUP"];

    const getApiPlayerData = (sideIndex, role) => {
      const teamPlayers = currentMatch?.teamsData[sideIndex]?.players || [];
      return teamPlayers.find(p => p.role.toUpperCase() === role.toUpperCase()) || null;
    };

    // Hàm mapping chung cho cả 2 bên
    const mapPlayers = (players, sideIndex) => {
      return (players ?? []).map((p, i) => {
        const apiData = getApiPlayerData(sideIndex, standardRoles[i]);
        return {
          gameName: p.playerName,         // Tên gốc trong game
          nickname: apiData?.nickname || p.playerName, // Tên tùy chỉnh từ API
          role: apiData?.role || standardRoles[i],     // Role (TOP, MID...)
          avatar: apiData?.avatar || null,              // Ảnh thẻ tuyển thủ
          // Lấy splashCenteredImg từ championAssets của League Client
          championSplash: p.championAssets?.splashCenteredImg || null, 
          side: sideIndex === 0 ? "BLUE" : "RED"
        };
      });
    };

    const bluePlayers = mapPlayers(tabs.Order?.players, 0);
    const redPlayers = mapPlayers(tabs.Chaos?.players, 1);

    return [...bluePlayers, ...redPlayers];
  }, [gameData?.tabs, currentMatch]);

  return {
    scoreboard: gameData?.scoreboard || null,
    allPlayerNames,
    matchInfo: currentMatch,
  };
};