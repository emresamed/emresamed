import { QueryClient } from '@tanstack/react-query';

/**
 * Global React Query client.
 *
 * Defaults tuned for a mobile app:
 * - 1 retry: avoid hammering Supabase on a flaky connection.
 * - 5 min staleTime: most gym data (programs, exercises) changes rarely.
 * - refetchOnWindowFocus disabled — native apps don't have window focus.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
