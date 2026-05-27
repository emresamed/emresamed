const getRequiredEnv = (key: "EXPO_PUBLIC_SUPABASE_URL" | "EXPO_PUBLIC_SUPABASE_ANON_KEY") => {
  const value = process.env[key];

  if (!value) {
    if (__DEV__) {
      console.warn(`[env] Missing ${key}. Add it to your .env file before enabling API features.`);
    }

    return "";
  }

  return value;
};

export const env = {
  EXPO_PUBLIC_SUPABASE_URL: getRequiredEnv("EXPO_PUBLIC_SUPABASE_URL"),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: getRequiredEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY")
};
