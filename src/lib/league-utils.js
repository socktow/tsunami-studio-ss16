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

  if (absValue >= 1000) {
    const rounded = Math.round(absValue / 100) / 10; 
    return `${rounded}k`;
  }

  return Math.round(absValue);
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

export const mapTabsToL2 = (tabs) => {
  if (!tabs?.Order?.players || !tabs?.Chaos?.players) return null;

  const mapPlayer = (p) => ({
    // ===== HALF 1 =====
    name: p.playerName,
    level: p.level,
    champ: p.championAssets?.squareImg,

    spell1: p.abilities?.[4]?.assets?.iconAsset,
    spell2: p.abilities?.[5]?.assets?.iconAsset,
    ulti: p.abilities?.[3]?.assets?.iconAsset,

    // ===== HALF 2 DATA =====

    hp: {
      current: p.health?.current ?? 0,
      max: p.health?.max ?? 1,
      pct: (p.health?.current / p.health?.max) * 100 || 0,
    },

    mp: {
      current: p.resource?.current ?? 0,
      max: p.resource?.max ?? 1,
      pct: (p.resource?.current / p.resource?.max) * 100 || 0,
    },

    xp: {
      current: p.experience?.current ?? 0,
      max: p.experience?.nextLevel ?? 1,
      pct: (p.experience?.current / p.experience?.nextLevel) * 100 || 0,
    },
  });

  return {
    order: tabs.Order.players.map(mapPlayer),
    chaos: tabs.Chaos.players.map(mapPlayer),
  };
};