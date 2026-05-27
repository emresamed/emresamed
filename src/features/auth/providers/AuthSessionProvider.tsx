import { type PropsWithChildren, useEffect } from "react";

import { getAuthErrorMessage } from "@/features/auth/utils/errors";
import {
  getCurrentSession,
  subscribeToAuthChanges
} from "@/features/auth/services/authService";
import { useAuthStore } from "@/store/authStore";

export function AuthSessionProvider({ children }: PropsWithChildren) {
  const setAuthError = useAuthStore((state) => state.setAuthError);
  const setInitializing = useAuthStore((state) => state.setInitializing);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    async function bootstrapSession() {
      try {
        unsubscribe = subscribeToAuthChanges((session) => {
          setSession(session);
          setAuthError(null);
          setInitializing(false);
        });

        const session = await getCurrentSession();

        if (!isMounted) {
          return;
        }

        setSession(session);
        setAuthError(null);
      } catch (error) {
        if (isMounted) {
          setSession(null);
          setAuthError(getAuthErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    }

    bootstrapSession();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [setAuthError, setInitializing, setSession]);

  return children;
}
