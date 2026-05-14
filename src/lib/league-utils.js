// Hằng số
export const IMAGE_BASE_URL = "http://localhost:58869/";

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

