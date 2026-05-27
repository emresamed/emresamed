import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthUser } from "../types/auth";

type AuthState = {
  user: AuthUser | null;
  isInitialized: boolean;
  setSession: (session: Session | null) => void;
  setInitialized: (isInitialized: boolean) => void;
  clearSession: () => void;
};

const sessionToAuthUser = (session: Session | null): AuthUser | null => {
  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? null
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isInitialized: false,
      setSession: (session) => {
        set({ user: sessionToAuthUser(session) });
      },
      setInitialized: (isInitialized) => {
        set({ isInitialized });
      },
      clearSession: () => {
        set({ user: null });
      }
    }),
    {
      name: "gymbro-auth",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user })
    }
  )
);
