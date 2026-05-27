import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  userId: string | null;
  accessToken: string | null;
  setSession: (payload: { userId: string; accessToken: string }) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      accessToken: null,
      setSession: ({ userId, accessToken }) => {
        set({ userId, accessToken });
      },
      clearSession: () => {
        set({ userId: null, accessToken: null });
      }
    }),
    {
      name: "gymbro-auth",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
