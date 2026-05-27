import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthState = {
  errorMessage: string | null;
  isInitializing: boolean;
  session: Session | null;
  user: User | null;
  clearAuthError: () => void;
  setAuthError: (message: string | null) => void;
  setInitialized: () => void;
  setSession: (session: Session | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  errorMessage: null,
  isInitializing: true,
  session: null,
  user: null,
  clearAuthError: () => set({ errorMessage: null }),
  setAuthError: (message) => set({ errorMessage: message }),
  setInitialized: () => set({ isInitializing: false }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
}));
