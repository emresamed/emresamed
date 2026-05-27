import { useAuthStore } from "@/store/authStore";

export function useAuthSession() {
  return useAuthStore((state) => ({
    authError: state.authError,
    isInitializing: state.isInitializing,
    session: state.session,
    user: state.user
  }));
}
