import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { UserProfile } from '@/types';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

const initialState = {
  session: null,
  user: null,
  profile: null,
  isLoading: false,
  isInitialized: false,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setSession: (session) =>
    set({ session, user: session?.user ?? null }),

  setProfile: (profile) =>
    set({ profile }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  setInitialized: (isInitialized) =>
    set({ isInitialized }),

  reset: () =>
    set(initialState),
}));
