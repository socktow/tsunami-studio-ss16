import { create } from 'zustand';

export const useOverlayStore = create((set) => ({
  showOverlay: false, // Mặc định ẩn tất cả
  showTop: false,
  showBottom: false,
  showLeft: false, 
  showSkin: false,
  activeRankView: 'gold', 
  allPlayerData: null,
  lastState: null, // Lưu trữ trạng thái trước khi ẩn hết

  setState: (newState) => set((state) => ({ ...state, ...newState })),
}));