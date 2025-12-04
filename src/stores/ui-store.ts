import { create } from "zustand";

type UIStore = {
  isTableLoading: boolean;
  setTableLoading: (value: boolean) => void;
  toggleTableLoading: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  isTableLoading: false,
  setTableLoading: (value) => set({ isTableLoading: value }),
  toggleTableLoading: () => set((state) => ({ isTableLoading: !state.isTableLoading })),
}));
