// Hằng số
export const IMAGE_BASE_URL = "http://localhost:58869/";

export const ITEM_SLOTS = {
  MAIN: [0, 1, 2, 3, 4, 5],
  TRINKET: 6,
  QUEST: 8,
};

// Hàm xử lý định dạng vàng (1500 -> 1.5k)
export const formatGold = (value) => {
  const absValue = Math.abs(value);
  if (absValue === 0) return "•";
  const formatted = absValue >= 1000 ? `${(absValue / 1000).toFixed(1)}k` : absValue;
  return formatted;
};

// Hàm tính phần trăm (HP/MP)
export const getPercentage = (current, max) => {
  if (!max || max === 0) return 0;
  return Math.max(0, Math.min(100, (current / max) * 100));
};

// Hàm tìm item theo slot
export const findItemBySlot = (items, slot) => {
  return items?.find((i) => i.slot === slot);
};

// Hàm bóc tách dữ liệu Team từ gameData
export const getTeamData = (gameData) => {
  if (!gameData?.tabs || !gameData?.scoreboardBottom) return null;
  return {
    blue: {
      tabs: gameData.tabs.Order.players,
      board: gameData.scoreboardBottom.teams[0].players,
    },
    red: {
      tabs: gameData.tabs.Chaos.players,
      board: gameData.scoreboardBottom.teams[1].players,
    },
  };
};