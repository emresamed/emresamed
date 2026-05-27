import { create } from "zustand";

type ThemeMode = "dark";

type AppState = {
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  themeMode: ThemeMode;
};

export const useAppStore = create<AppState>((set) => ({
  hasCompletedOnboarding: false,
  setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
  themeMode: "dark"
}));
