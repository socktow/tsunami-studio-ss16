import { useMemo } from "react";
import { useLeagueData } from "@/app/context/LeaguePregameContext";

export default function usePregamedata() {
  const { gameData } = useLeagueData();

  return useMemo(() => {
    // 1. Kiểm tra nếu chưa có data hoặc không đúng loại dữ liệu cấm chọn
    if (!gameData || (gameData.type !== "champion-select-state-update" && gameData.state?.type !== "champion-select-state-update")) {
      return null;
    }

    // 2. Định vị chính xác tầng chứa dữ liệu (Root hoặc .state)
    const stateData = gameData.state ? gameData.state : gameData;

    const blueTeamRaw = stateData?.blueTeam;
    const redTeamRaw = stateData?.redTeam;
    const metaDataRaw = stateData?.metaData;
    const timerRaw = stateData?.timer;

    // Hàm bổ trợ 1: Lọc dữ liệu của mảng BAN THƯỜNG (Bans)
    const formatBans = (bansArray) => {
      return (bansArray || []).map((banItem) => ({
        isActive: banItem?.isActive ?? false,
        champion: banItem?.champion
          ? {
              id: banItem.champion.id,
              name: banItem.champion.name,
              alias: banItem.champion.alias,
              squareImg: banItem.champion.squareImg,
            }
          : null,
      }));
    };

    // Hàm bổ trợ 2: Lọc dữ liệu của FEARLESS BAN
    const formatFearlessBans = (fearlessBansObj) => {
      if (!fearlessBansObj) return {};
      const formatted = {};
      Object.keys(fearlessBansObj).forEach((gameIndex) => {
        const championsArray = fearlessBansObj[gameIndex] || [];
        formatted[gameIndex] = championsArray.map((champ) => ({
          id: champ?.id,
          name: champ?.name,
          alias: champ?.alias,
          squareImg: champ?.squareImg,
        }));
      });
      return formatted;
    };

    // Hàm bổ trợ 3: Lọc dữ liệu của lượt PICK (Slots)
    const formatSlots = (slotsArray) => {
      return (slotsArray || []).map((slotItem) => ({
        id: slotItem?.id,
        isActive: slotItem?.isActive ?? false,
        champion: slotItem?.champion
          ? {
              id: slotItem.champion.id,
              alias: slotItem.champion.alias,
              name: slotItem.champion.name,
              splashCenteredImg: slotItem.champion.splashCenteredImg, // Lấy ảnh splash chữ nhật để làm nền khung pick
            }
          : null, // Nếu slot này chưa khóa/chọn tướng thì trả về null
      }));
    };

    // 3. Tiến hành lọc và cấu trúc lại đúng các thông tin
    return {
      // Dữ liệu Đội Xanh
      blueTeam: {
        bans: formatBans(blueTeamRaw?.bans),
        fearlessBans: formatFearlessBans(blueTeamRaw?.fearlessBans),
        slots: formatSlots(blueTeamRaw?.slots), // Đã lọc slots
        timeline: blueTeamRaw?.timeline || {},
      },

      // Dữ liệu Đội Đỏ
      redTeam: {
        bans: formatBans(redTeamRaw?.bans),
        fearlessBans: formatFearlessBans(redTeamRaw?.fearlessBans),
        slots: formatSlots(redTeamRaw?.slots), // Đã lọc slots
        timeline: redTeamRaw?.timeline || {},
      },

      // Dữ liệu Meta & Trận đấu
      metaData: {
        patch: metaDataRaw?.patch || "Unknown",
        bestOfType: metaDataRaw?.bestOfType || "BO3",
        matchData: {
          matchId: metaDataRaw?.matchData?.matchId ?? 0,
          name: metaDataRaw?.matchData?.name || "Mock Match",
          type: metaDataRaw?.matchData?.type || "BestOf5",
          isActive: metaDataRaw?.matchData?.isActive ?? false,
          date: metaDataRaw?.matchData?.date || "",
        },
      },

      // Dữ liệu Bộ đếm thời gian
      timer: {
        phaseName: timerRaw?.phaseName || "UNKNOWN",
        phaseDuration: timerRaw?.phaseDuration ?? 0,
        timeRemaining: timerRaw?.timeRemaining ?? 0,
      },
    };
  }, [gameData]);
}