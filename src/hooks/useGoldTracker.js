import { useEffect, useMemo } from 'react';
import { useScoreboardSelector } from './useLeagueSelector';
import { useScoreboardData } from "./useApiTeamData";

// Cache toàn cục nằm độc lập bên ngoài vòng đời React Component
export let GLOBAL_GOLD_HISTORY = [{ time: 0, gold: 0 }];
let GLOBAL_LAST_SECONDS = 0;
let GLOBAL_CURRENT_SESSION = "";

export const useGoldTracker = () => {
  const { matchInfo } = useScoreboardData();
  const liveData = useScoreboardSelector();

  const gameSessionId = useMemo(() => {
    if (!matchInfo) return "";
    const scoreSum = (matchInfo.teamsData?.[0]?.score || 0) + (matchInfo.teamsData?.[1]?.score || 0);
    return `${matchInfo.id}_${scoreSum}`;
  }, [matchInfo]);

  const exactCurrentTime = useMemo(() => (liveData?.gameTime || 0) / 60, [liveData?.gameTime]);
  const currentMinute = Math.floor(exactCurrentTime);
  const currentGoldDiff = (liveData?.blueTeam?.gold || 0) - (liveData?.redTeam?.gold || 0);

  useEffect(() => {
    if (gameSessionId && gameSessionId !== GLOBAL_CURRENT_SESSION) {
      GLOBAL_GOLD_HISTORY = [{ time: 0, gold: 0 }];
      GLOBAL_LAST_SECONDS = 0;
      GLOBAL_CURRENT_SESSION = gameSessionId;
      return;
    }

    if (!liveData) return;
    const newSeconds = liveData.gameTime || 0;

    if (newSeconds < GLOBAL_LAST_SECONDS && newSeconds < 60) {
      GLOBAL_GOLD_HISTORY = [{ time: 0, gold: 0 }];
      GLOBAL_LAST_SECONDS = newSeconds;
      return;
    }
    GLOBAL_LAST_SECONDS = newSeconds;

    if (currentMinute === 0) {
      GLOBAL_GOLD_HISTORY = [{ time: 0, gold: 0 }];
      return;
    }

    const existsIdx = GLOBAL_GOLD_HISTORY.findIndex(item => item.time === currentMinute);
    
    if (existsIdx !== -1) {
      // 🔴 ĐÃ SỬA: Tạo bản sao mảng mới rồi ghi đè index, giải quyết triệt để lỗi "Read only property"
      const updatedHistory = [...GLOBAL_GOLD_HISTORY];
      updatedHistory[existsIdx] = { time: currentMinute, gold: currentGoldDiff };
      GLOBAL_GOLD_HISTORY = updatedHistory;
    } else {
      // 🔴 ĐÃ SỬA: Dùng Spread Operator để thêm phần tử mới thay vì dùng hàm .push() trực tiếp
      GLOBAL_GOLD_HISTORY = [...GLOBAL_GOLD_HISTORY, { time: currentMinute, gold: currentGoldDiff }];
    }
  }, [currentMinute, currentGoldDiff, liveData, gameSessionId]);

  return {
    goldHistory: GLOBAL_GOLD_HISTORY,
    exactCurrentTime,
    currentGoldDiff
  };
};