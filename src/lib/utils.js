import { ICONS } from "./constants";

export const formatGold = (gold) => {
  if (!gold) return "0.0k";
  return (gold / 1000).toFixed(1) + "k";
};

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

export const getDragonIcon = (type) => {
  return ICONS.DRAGONS[type?.toLowerCase()] || "";
};

export const getDragonType = (rawType) => {
  if (!rawType) return "air"; // mặc định
  return rawType.replace("DRAGON_", "").toLowerCase();
};