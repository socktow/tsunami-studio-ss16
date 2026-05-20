import { create } from 'zustand';

export const useOverlayStore = create((set) => ({
  showOverlay: false, // Mặc định ẩn tất cả
  showTop: false,
  showBottom: false,
  showLeft: false, 
  showSkin: false,
  showplayercard: false,
  showplayerRunes: false,
  showGoldGraph: false,
  showkillfeedcustom: false,
  showTeamFightNoDamage : false,
  showMatchup: false,
  activeRankView: 'gold', 
  allPlayerData: null,
  lastState: null,

  setState: (newState) => set((state) => ({ ...state, ...newState })),
}));