import Constants from 'expo-constants';

/**
 * Typed access to runtime environment values declared in app.config.ts > extra.
 * Throws early if a required value is missing so we never ship a broken build.
 */
type Extra = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function required(key: keyof Extra): string {
  const value = extra[key];
  if (!value) {
    throw new Error(
      `[env] Missing "${key}". Did you forget to set EXPO_PUBLIC_${key
        .replace(/[A-Z]/g, (m) => `_${m}`)
        .toUpperCase()} in .env?`,
    );
  }
  return value;
}

export const env = {
  supabaseUrl: required('supabaseUrl'),
  supabaseAnonKey: required('supabaseAnonKey'),
} as const;
