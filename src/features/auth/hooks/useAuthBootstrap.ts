import { useEffect } from 'react';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store';

/**
 * Initializes auth state at app start.
 *
 *  1. Reads the cached session from AsyncStorage (already restored by supabase-js).
 *  2. Subscribes to ALL future auth events (sign-in, sign-out, token refresh,
 *     external sign-out, password change) and mirrors them into the Zustand store.
 *
 * Mount this ONCE at the root layout. Mutations only call supabase.auth.* —
 * they never set the store themselves, because the listener will do it.
 */
export function useAuthBootstrap() {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [setSession]);
}
