import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '@/services/api/supabase';
import type { AsyncStatus } from '@/types';

interface AuthState {
  session: Session | null;
  user: User | null;
  status: AsyncStatus;
  isInitialized: boolean;
  setSession: (session: Session | null) => void;
  setStatus: (status: AsyncStatus) => void;
  setInitialized: (value: boolean) => void;
  signOut: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  session: null,
  user: null,
  status: 'idle' as AsyncStatus,
  isInitialized: false,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      status: session ? 'success' : 'idle',
    }),

  setStatus: (status) => set({ status }),

  setInitialized: (value) => set({ isInitialized: value }),

  signOut: async () => {
    set({ status: 'loading' });
    await supabase.auth.signOut();
    get().reset();
  },

  reset: () => set({ ...initialState, isInitialized: true }),
}));

export const selectIsAuthenticated = (state: AuthState) => Boolean(state.session);
