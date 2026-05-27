import { useEffect } from "react";

import { getCurrentSession, subscribeToAuthChanges } from "../../../services/auth/auth.service";
import { isSupabaseConfigured } from "../../../services/supabase/client";
import { useAuthStore } from "../../../store/auth.store";

export const useAuthSession = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const setInitialized = useAuthStore((state) => state.setInitialized);

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      setSession(null);
      setInitialized(true);
      return;
    }

    const initializeSession = async () => {
      try {
        const session = await getCurrentSession();

        if (mounted) {
          setSession(session);
        }
      } catch {
        if (mounted) {
          setSession(null);
        }
      } finally {
        if (mounted) {
          setInitialized(true);
        }
      }
    };

    initializeSession();

    const authSubscription = subscribeToAuthChanges((_event, session) => {
      setSession(session);
      setInitialized(true);
    });

    return () => {
      mounted = false;
      authSubscription.data.subscription.unsubscribe();
    };
  }, [setInitialized, setSession]);
};
