/**
 * Centralised route paths.
 * Using constants here means we never hand-type a route string in screens —
 * refactors stay safe and TypeScript catches typos.
 */
export const ROUTES = {
  // Auth (Phase 2)
  login: '/(auth)/login',
  register: '/(auth)/register',
  forgotPassword: '/(auth)/forgot-password',

  // Tabs (Phase 4)
  home: '/(tabs)/home',
  programs: '/(tabs)/programs',
  exercises: '/(tabs)/exercises',
  profile: '/(tabs)/profile',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
