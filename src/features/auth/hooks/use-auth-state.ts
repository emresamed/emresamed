import { useAuthStore } from "../../../store/auth.store";

export const useAuthState = () => {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return {
    user,
    isInitialized,
    isAuthenticated: Boolean(user)
  };
};
