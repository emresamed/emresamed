import Constants from 'expo-constants';

type EnvKey = 'EXPO_PUBLIC_SUPABASE_URL' | 'EXPO_PUBLIC_SUPABASE_ANON_KEY';

function getEnv(key: EnvKey): string {
  const value = process.env[key] ?? Constants.expoConfig?.extra?.[key];

  if (!value) {
    if (__DEV__) {
      console.warn(`[env] Missing ${key}. Copy .env.example to .env and add your values.`);
    }
    return '';
  }

  return value;
}

export const env = {
  supabaseUrl: getEnv('EXPO_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  isDev: __DEV__,
} as const;

export function assertEnvConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
