import { useCallback } from "react";

import { authService } from "@services/supabase";
import { useAuthStore } from "@stores/authStore";

export function useAuth() {
  const clearAuthError = useAuthStore((state) => state.clearAuthError);
  const errorMessage = useAuthStore((state) => state.errorMessage);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const session = useAuthStore((state) => state.session);
  const setAuthError = useAuthStore((state) => state.setAuthError);
  const user = useAuthStore((state) => state.user);

  const signOut = useCallback(async () => {
    try {
      clearAuthError();
      await authService.signOut();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Unable to sign out.");
    }
  }, [clearAuthError, setAuthError]);

  return {
    clearAuthError,
    errorMessage,
    isAuthenticated: Boolean(session),
    isInitializing,
    session,
    signOut,
    user,
  };
}
