import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';

export function useForgotPassword() {
  const { mutate, isPending, error, isSuccess, reset } = useMutation({
    mutationFn: (email: string) => authService.sendPasswordResetEmail(email),
  });

  return {
    sendResetEmail: mutate,
    isLoading: isPending,
    isSuccess,
    error: error as Error | null,
    reset,
  };
}
