import { useCallback } from 'react';

import { getAuthErrorMessage } from '@/lib/auth/errors';
import {
  resetPasswordForEmail,
  signInWithEmail,
  signUpWithEmail,
  type SignInParams,
  type SignUpParams,
} from '@/services/auth/authService';
import { useAuthStore, selectIsAuthenticated } from '@/stores/authStore';

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const setSession = useAuthStore((state) => state.setSession);
  const setStatus = useAuthStore((state) => state.setStatus);
  const signOut = useAuthStore((state) => state.signOut);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const signIn = useCallback(
    async (params: SignInParams) => {
      setStatus('loading');

      const { session: nextSession, error } = await signInWithEmail(params);

      if (error) {
        setStatus('error');
        throw new Error(getAuthErrorMessage(error));
      }

      setSession(nextSession);
    },
    [setSession, setStatus],
  );

  const signUp = useCallback(
    async (params: SignUpParams) => {
      setStatus('loading');

      const { session: nextSession, error } = await signUpWithEmail(params);

      if (error) {
        setStatus('error');
        throw new Error(getAuthErrorMessage(error));
      }

      if (nextSession) {
        setSession(nextSession);
      } else {
        setStatus('idle');
      }
    },
    [setSession, setStatus],
  );

  const resetPassword = useCallback(
    async (email: string) => {
      setStatus('loading');

      const { error } = await resetPasswordForEmail(email);

      if (error) {
        setStatus('error');
        throw new Error(getAuthErrorMessage(error));
      }

      setStatus('idle');
    },
    [setStatus],
  );

  return {
    session,
    user,
    status,
    isInitialized,
    isAuthenticated,
    isLoading: status === 'loading',
    signIn,
    signUp,
    resetPassword,
    signOut,
  };
}
