import { useMutation } from '@tanstack/react-query';
import { authService, SignInCredentials } from '@/services/auth.service';

export function useSignIn() {
  const { mutate, isPending, error, reset } = useMutation({
    mutationFn: (credentials: SignInCredentials) => authService.signIn(credentials),
  });

  return {
    signIn: mutate,
    isLoading: isPending,
    error: error as Error | null,
    reset,
  };
}
