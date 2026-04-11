import { create } from 'zustand';

export const useOverlayStore = create((set) => ({
  showOverlay: true,
  showTop: true,
  showBottom: true,
  showLeft: true, 
  activeRankView: 'gold', 
  gameData: null,

  setState: (newState) => set((state) => ({ ...state, ...newState })),
}));