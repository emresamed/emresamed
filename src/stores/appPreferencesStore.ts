import { create } from "zustand";

type AppPreferencesState = {
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
};

export const useAppPreferencesStore = create<AppPreferencesState>((set) => ({
  hasCompletedOnboarding: false,
  setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
}));
