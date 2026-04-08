import { create } from "zustand";

export const useOverlayStore = create((set) => ({
  showOverlay: true,
  showTop: false,
  showBottom: false,

  setState: (data) => set((state) => ({ ...state, ...data })),
}));