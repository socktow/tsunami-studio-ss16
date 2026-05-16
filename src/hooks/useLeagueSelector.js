import { useMemo } from "react";
import { useLeagueData } from "@/app/context/LeagueDataContext";

// Hàm bổ trợ giúp tự động tìm kiếm data ở tầng root hoặc tầng .state
const getNestedData = (gameData) => {
  if (!gameData) return null;
  return gameData.state ? gameData.state : gameData;
};

// 1. Hook lấy dữ liệu thô từ scoreboard
export const useScoreboardData = () => {
  const { gameData } = useLeagueData();
  return useMemo(() => {
    const data = getNestedData(gameData);
    return data?.scoreboard || null;
  }, [gameData]);
};

export const useObjectivesData = () => {
  const { gameData } = useLeagueData();

  return useMemo(() => {
    if (!gameData) return null;
    const data = getNestedData(gameData);
    const gameTime = data?.gameTime || 0;

    return {
      gameTime,
      baron: {
        type: data?.baronPitTimer?.type,
        timeLeft: (data?.baronPitTimer?.timeAlive || 0) - gameTime,
      },
      dragon: {
        type: data?.dragonPitTimer?.type,
        timeLeft: (data?.dragonPitTimer?.timeAlive || 0) - gameTime,
      },
    };
  }, [gameData]);
};

export const useScoreboardSelector = () => {
  const { gameData } = useLeagueData();
  
  return useMemo(() => {
    const data = getNestedData(gameData);
    const scoreboard = data?.scoreboard;
    
    if (!data || !scoreboard || !scoreboard.teams || scoreboard.teams.length < 2) {
      return null;
    }

    const blueTeamData = scoreboard.teams[0];
    const redTeamData = scoreboard.teams[1];

    return {
      gameTime: data.gameTime || 0,
      bestOf: scoreboard.bestOf || 3,
      
      blueTeam: {
        kills: blueTeamData.kills || 0,
        gold: blueTeamData.gold || 0,
        towers: blueTeamData.towers || 0,
        grubs: blueTeamData.grubs || 0,
        dragons: blueTeamData.dragons || [],
        baronPowerPlay: blueTeamData.baronPowerPlay,
        dragonPowerPlay: blueTeamData.dragonPowerPlay,
        teamTag: blueTeamData.teamTag,
        teamName: blueTeamData.teamName
      },
      
      redTeam: {
        kills: redTeamData.kills || 0,
        gold: redTeamData.gold || 0,
        towers: redTeamData.towers || 0,
        grubs: redTeamData.grubs || 0,
        dragons: redTeamData.dragons || [],
        baronPowerPlay: redTeamData.baronPowerPlay,
        dragonPowerPlay: redTeamData.dragonPowerPlay,
        teamTag: redTeamData.teamTag,
        teamName: redTeamData.teamName
      },
      rawScoreboard: scoreboard 
    };
  }, [gameData]); 
};

export const useRankingSelector = (view = "gold") => {
  const { gameData } = useLeagueData();

  return useMemo(() => {
    const data = getNestedData(gameData);
    const teams = data?.scoreboardBottom?.teams || [];
    const tabs = data?.tabs;
    if (!tabs) return [];

    const allPlayers = [
      ...(tabs.Order?.players || []).map((p) => ({ ...p, teamSide: "blue" })),
      ...(tabs.Chaos?.players || []).map((p) => ({ ...p, teamSide: "red" })),
    ];

    const combined = allPlayers.map((player) => {
      const teamIndex = player.teamSide === "blue" ? 0 : 1;
      const scorePlayer = teams[teamIndex]?.players?.find(
        (p) => p.champion?.name === player.championAssets?.name || p.name === player.playerName,
      );

      return {
        ...player,
        displayName: player.playerName || player.championAssets?.name,
        totalGold: scorePlayer?.totalGold || 0,
        splash: player.championAssets?.splashCenteredImg,
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
  }, [gameData, view]);
};

export const useScoreboardBottomSelector = () => {
  const { gameData } = useLeagueData();

  return useMemo(() => {
    const data = getNestedData(gameData);
    const scoreboardBottom = data?.scoreboardBottom;
    const tabs = data?.tabs;

    if (!scoreboardBottom?.teams || !tabs) return null;

    const teams = scoreboardBottom.teams.map((team, teamIndex) => {
      const tabPlayers = teamIndex === 0 ? tabs.Order?.players : tabs.Chaos?.players;

      return {
        id: team.id,
        name: team.name,
        tag: team.tag,
        players: (team.players || []).map((p, pIndex) => {
          const t = tabPlayers?.[pIndex];

          return {
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

            champ: t?.championAssets?.squareImg,
            spell1: t?.abilities?.[4] || {},
            spell2: t?.abilities?.[5] || {},
            ulti: t?.abilities?.[3],

            respawnAt: t?.respawnAt ?? 0,
            stacksData: t?.stacksData ?? null,
            hasBaron: t?.hasBaron ?? false,
            hasElder: t?.hasElder ?? false,

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
            kda: p.deaths === 0 ? p.kills + p.assists : ((p.kills + p.assists) / p.deaths).toFixed(2),
          };
        }),
      };
    });

    return {
      gameTime: scoreboardBottom.gameTime || 0,
      teams,
    };
  }, [gameData]);
};