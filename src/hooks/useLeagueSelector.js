import { useMemo } from "react";
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
      },
    };
  }, [gameData?.gameTime, gameData?.baronPitTimer, gameData?.dragonPitTimer]);
};

// 3. Top Center - Bảng điểm (Tối ưu re-render)
export const useScoreboardSelector = () => {
  const { gameData } = useLeagueData();
  const scoreboard = gameData?.scoreboard;

  return useMemo(() => {
    if (!scoreboard || !scoreboard.teams || scoreboard.teams.length < 2)
      return null;

    return {
      gameTime: gameData.gameTime || scoreboard.gameTime || 0,
      bestOf: scoreboard.bestOf || 3,
      blueTeam: scoreboard.teams[0],
      redTeam: scoreboard.teams[1],
    };
  }, [gameData?.gameTime, scoreboard]);
};

// 4. Left Panel - Dynamic Ranking Gold / EXP
export const useRankingSelector = (view = "gold") => {
  const { gameData } = useLeagueData();

  return useMemo(() => {
    const teams = gameData?.scoreboardBottom?.teams || [];
    const tabs = gameData?.tabs;
    if (!tabs) return [];

    const allPlayers = [
      ...(tabs.Order?.players || []).map((p) => ({ ...p, teamSide: "blue" })),
      ...(tabs.Chaos?.players || []).map((p) => ({ ...p, teamSide: "red" })),
    ];

    const combined = allPlayers.map((player) => {
      const teamIndex = player.teamSide === "blue" ? 0 : 1;
      const scorePlayer = teams[teamIndex]?.players?.find(
        (p) => p.champion?.name === player.championAssets?.name,
      );

      return {
        ...player,
        displayName: player.playerName || player.championAssets?.name,
        totalGold: scorePlayer?.totalGold || 0,
        splash: player.championAssets?.splashCenteredImg,
        // Đảm bảo dữ liệu level/exp luôn tồn tại để sort
        level: player.level || 1,
        experience: player.experience || {
          current: 0,
          previousLevel: 0,
          nextLevel: 100,
        },
      };
    });

    return [...combined].sort((a, b) => {
      if (view === "gold") return b.totalGold - a.totalGold;
      if (b.level !== a.level) return b.level - a.level;
      return (b.experience?.current || 0) - (a.experience?.current || 0);
    });
    // Dependency cụ thể giúp tránh tính toán lại nếu các phần khác của gameData thay đổi
  }, [gameData?.scoreboardBottom, gameData?.tabs, view]);
};

export const useScoreboardBottomSelector = () => {
  const { gameData } = useLeagueData();

  const scoreboardBottom = gameData?.scoreboardBottom;
  const tabs = gameData?.tabs;

  return useMemo(() => {
    if (!scoreboardBottom?.teams || !tabs) return null;

    const teams = scoreboardBottom.teams.map((team, teamIndex) => {
      // 0: Order/Blue, 1: Chaos/Red
      const tabPlayers =
        teamIndex === 0 ? tabs.Order?.players : tabs.Chaos?.players;

      return {
        id: team.id,
        name: team.name,
        tag: team.tag,
        players: (team.players || []).map((p, pIndex) => {
          const t = tabPlayers?.[pIndex];

          return {
            // --- DỮ LIỆU TỪ SCOREBOARD BOTTOM (Stats) ---
            name: p.name || t?.playerName,
            champion: p.champion || t?.championAssets?.squareImg,
            splash: t?.championAssets?.splashCenteredImg,
            kills: p.kills ?? 0,
            deaths: p.deaths ?? 0,
            assists: p.assists ?? 0,
            creepScore: p.creepScore ?? 0,
            totalGold: p.totalGold ?? 0,
            level: p.level || t?.level || 1,
            items: p.items ?? [],
            perks: t?.perks ?? [],
            shutdown: p?.shutdown ?? 0,
            visionScore: p?.visionScore ?? [],

            // --- DỮ LIỆU TỪ TABS (Assets & Status) ---
            champ: t?.championAssets?.squareImg,
            spell1: t?.abilities?.[4] || {},
            spell2: t?.abilities?.[5] || {},
            ulti: t?.abilities?.[3],

            // Trạng thái hồi sinh và cộng dồn
            respawnAt: t?.respawnAt ?? 0,
            stacksData: t?.stacksData ?? null,

            // --- THUỘC TÍNH BUFF (MỚI THÊM) ---
            hasBaron: t?.hasBaron ?? false,
            hasElder: t?.hasElder ?? false,

            // Thanh trạng thái (%)
            hp: {
              pct: (t?.health?.current / t?.health?.max) * 100 || 0,
            },
            mp: {
              pct: (t?.resource?.current / t?.resource?.max) * 100 || 0,
            },
            xp: {
              pct: (() => {
                const current = t?.experience?.current ?? 0;
                const previous = t?.experience?.previousLevel ?? 0;
                const next = t?.experience?.nextLevel ?? 0;

                const currentXp = current - previous;
                const requiredXp = next - previous;

                if (requiredXp <= 0) return 0;

                return (currentXp / requiredXp) * 100;
              })(),
            },

            // Logic tính toán thêm
            kda:
              p.deaths === 0
                ? p.kills + p.assists
                : ((p.kills + p.assists) / p.deaths).toFixed(2),
          };
        }),
      };
    });

    return {
      gameTime: scoreboardBottom.gameTime || 0,
      teams,
    };
  }, [scoreboardBottom, tabs]);
};
