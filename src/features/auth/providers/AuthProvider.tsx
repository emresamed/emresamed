import { useEffect, type PropsWithChildren } from "react";

import { authService } from "@services/supabase";
import { useAuthStore } from "@stores/authStore";

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unable to initialize authentication.";

type AuthSubscription = {
  unsubscribe: () => void;
};

export function AuthProvider({ children }: PropsWithChildren) {
  const setAuthError = useAuthStore((state) => state.setAuthError);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    let isMounted = true;
    let subscription: AuthSubscription | undefined;

    const initializeAuth = async () => {
      try {
        const session = await authService.getSession();

        if (isMounted) {
          setSession(session);
        }

        subscription = authService.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          setAuthError(null);
        });
      } catch (error: unknown) {
        if (isMounted) {
          setAuthError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setInitialized();
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [setAuthError, setInitialized, setSession]);

  return children;
}
