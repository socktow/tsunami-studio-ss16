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
  const realData = useMemo(() => {
    if (!gameData) return null;
    return gameData.state ? gameData.state : gameData;
  }, [gameData]);

  const allPlayerNames = useMemo(() => {
    const tabs = realData?.tabs;
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
          gameName: p.playerName,                        
          nickname: apiData?.nickname || p.playerName,    
          role: apiData?.role || standardRoles[i],         
          avatar: apiData?.avatar || null,                
          championSplash: p.championAssets?.splashCenteredImg || null, 
          side: sideIndex === 0 ? "BLUE" : "RED"
        };
      });
    };

    const bluePlayers = mapPlayers(tabs.Order?.players, 0);
    const redPlayers = mapPlayers(tabs.Chaos?.players, 1);

    return [...bluePlayers, ...redPlayers];
  }, [realData?.tabs, currentMatch]);

  return {
    scoreboard: realData?.scoreboard || null,
    allPlayerNames,
    matchInfo: currentMatch,
  };
};