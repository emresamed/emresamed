import type { ExpoConfig, ConfigContext } from 'expo/config';

/**
 * Dynamic Expo configuration.
 * Reads runtime values from process.env so the same binary
 * can be built against dev / staging / prod Supabase projects.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GymBro',
  slug: 'gymbro',
  scheme: 'gymbro',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#0A0A0B',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.gymbro.app',
  },
  android: {
    package: 'com.gymbro.app',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0A0A0B',
    },
  },
  plugins: ['expo-router', 'expo-secure-store'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
});
