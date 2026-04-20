import { useMemo } from 'react';
import { useLeagueData } from "@/app/context/LeagueDataContext";

// 1. Hook lấy dữ liệu thô từ scoreboard (Dùng cho các mục đích chung)
export const useScoreboardData = () => {
  const { gameData } = useLeagueData();
  return useMemo(() => gameData?.scoreboard || null, [gameData?.scoreboard]);
};

// 2. Top left - Thời gian hồi mục tiêu (Tối ưu hóa tính toán)
export const useObjectivesData = () => {
  const { gameData } = useLeagueData();
  
  return useMemo(() => {
    if (!gameData) return null;
    const gameTime = gameData.gameTime || 0;

    return {
      gameTime,
      baron: {
        type: gameData.baronPitTimer?.type,
        timeLeft: (gameData.baronPitTimer?.timeAlive || 0) - gameTime,
      },
      dragon: {
        type: gameData.dragonPitTimer?.type,
        timeLeft: (gameData.dragonPitTimer?.timeAlive || 0) - gameTime,
      }
    };
  }, [gameData?.gameTime, gameData?.baronPitTimer, gameData?.dragonPitTimer]);
};

// 3. Top Center - Bảng điểm (Tối ưu re-render)
export const useScoreboardSelector = () => {
  const { gameData } = useLeagueData();
  const scoreboard = gameData?.scoreboard;

  return useMemo(() => {
    if (!scoreboard || !scoreboard.teams || scoreboard.teams.length < 2) return null;

    return {
      gameTime: gameData.gameTime || scoreboard.gameTime || 0,
      bestOf: scoreboard.bestOf || 3,
      blueTeam: scoreboard.teams[0],
      redTeam: scoreboard.teams[1],
    };
  }, [gameData?.gameTime, scoreboard]);
};

// 4. Left Panel - Dynamic Ranking Gold / EXP
export const useRankingSelector = (view = 'gold') => {
  const { gameData } = useLeagueData();

  return useMemo(() => {
    const teams = gameData?.scoreboardBottom?.teams || [];
    const tabs = gameData?.tabs;
    if (!tabs) return [];

    const allPlayers = [
      ...(tabs.Order?.players || []).map(p => ({ ...p, teamSide: 'blue' })), 
      ...(tabs.Chaos?.players || []).map(p => ({ ...p, teamSide: 'red' }))
    ];

    const combined = allPlayers.map((player) => {
      const teamIndex = player.teamSide === 'blue' ? 0 : 1;
      const scorePlayer = teams[teamIndex]?.players?.find(
        p => p.champion?.name === player.championAssets?.name
      );
      
      return {
        ...player,
        displayName: player.playerName || player.championAssets?.name,
        totalGold: scorePlayer?.totalGold || 0,
        splash: player.championAssets?.splashCenteredImg,
        // Đảm bảo dữ liệu level/exp luôn tồn tại để sort
        level: player.level || 1,
        experience: player.experience || { current: 0, previousLevel: 0, nextLevel: 100 }
      };
    });

    return [...combined].sort((a, b) => {
      if (view === 'gold') return b.totalGold - a.totalGold;
      if (b.level !== a.level) return b.level - a.level;
      return (b.experience?.current || 0) - (a.experience?.current || 0);
    });
    // Dependency cụ thể giúp tránh tính toán lại nếu các phần khác của gameData thay đổi
  }, [gameData?.scoreboardBottom, gameData?.tabs, view]);
};