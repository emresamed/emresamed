import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { env } from '@/constants/env';

/**
 * Singleton Supabase client.
 *
 * Auth tokens are persisted with AsyncStorage so users stay logged in across launches.
 * (Phase 2 will wrap this with hooks; never call .auth.* directly from a screen.)
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
