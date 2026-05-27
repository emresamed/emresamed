type PublicEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

const getEnvValue = (value: string | undefined, name: string) => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

export const getPublicEnv = (): PublicEnv => ({
  supabaseUrl: getEnvValue(process.env.EXPO_PUBLIC_SUPABASE_URL, "EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnvValue(
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  ),
});
