import { useAuthStore, selectIsAuthenticated } from '@/stores/authStore';

export function useAuthGuard() {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  return {
    isInitialized,
    isAuthenticated,
    isLoading: !isInitialized,
  };
}
