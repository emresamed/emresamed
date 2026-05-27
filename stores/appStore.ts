import { create } from 'zustand';

interface AppState {
  isOnboarded: boolean;
  activeWorkoutId: string | null;
  setOnboarded: (value: boolean) => void;
  setActiveWorkoutId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnboarded: false,
  activeWorkoutId: null,

  setOnboarded: (value) => set({ isOnboarded: value }),
  setActiveWorkoutId: (id) => set({ activeWorkoutId: id }),
}));
