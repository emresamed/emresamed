import { useAuthStore } from '@/store';

/**
 * Convenience reader hook. Memo-free because Zustand handles selector equality.
 * Screens that only need the user/status should use this instead of
 * pulling from useAuthStore directly — it keeps consumer code aligned
 * with the auth feature's public surface.
 */
export function useAuth() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);

  return {
    status,
    user,
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
  };
}
