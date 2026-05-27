import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthState = {
  authError: string | null;
  isInitializing: boolean;
  session: Session | null;
  setAuthError: (message: string | null) => void;
  setInitializing: (value: boolean) => void;
  setSession: (session: Session | null) => void;
  user: User | null;
};

export const useAuthStore = create<AuthState>((set) => ({
  authError: null,
  isInitializing: true,
  session: null,
  setAuthError: (message) => set({ authError: message }),
  setInitializing: (value) => set({ isInitializing: value }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  user: null
}));
