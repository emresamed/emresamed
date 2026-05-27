export const APP_CONFIG = {
  name: 'GymBro',
  slug: 'gymbro',
  scheme: 'gymbro',
  version: '1.0.0',
} as const;

export const QUERY_CONFIG = {
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 30,
  retry: 2,
} as const;

export const STORAGE_KEYS = {
  authSession: 'gymbro-auth-session',
} as const;
