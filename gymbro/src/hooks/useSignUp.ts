import { useMutation } from '@tanstack/react-query';
import { authService, SignUpCredentials } from '@/services/auth.service';

export function useSignUp() {
  const { mutate, isPending, error, isSuccess, reset } = useMutation({
    mutationFn: (credentials: SignUpCredentials) => authService.signUp(credentials),
  });

  return {
    signUp: mutate,
    isLoading: isPending,
    isSuccess,
    error: error as Error | null,
    reset,
  };
}
