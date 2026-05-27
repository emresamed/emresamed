export const ROUTES = {
  tabs: {
    home: '/(tabs)',
    programs: '/(tabs)/programs',
    exercises: '/(tabs)/exercises',
    profile: '/(tabs)/profile',
  },
  auth: {
    login: '/(auth)/login',
    register: '/(auth)/register',
    forgotPassword: '/(auth)/forgot-password',
  },
} as const;
