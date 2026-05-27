export type AppEnvironment = "development" | "preview" | "production";

export type EnvConfig = {
  appEnv: AppEnvironment;
  supabaseAnonKey?: string;
  supabaseUrl?: string;
};

const appEnv = process.env.EXPO_PUBLIC_APP_ENV ?? "development";

export const env: EnvConfig = {
  appEnv,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL
};

export function getRequiredEnvValue(key: "supabaseAnonKey" | "supabaseUrl") {
  const value = env[key];

  if (!value) {
    throw new Error(`Missing required environment value: ${key}`);
  }

  return value;
}
