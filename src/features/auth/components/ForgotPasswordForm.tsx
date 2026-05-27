import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';

import { useResetPassword } from '../hooks/useAuthMutations';
import { validateEmail } from '../validators';

import { FormError } from './FormError';

type Props = {
  onSubmitted: (email: string) => void;
};

export function ForgotPasswordForm({ onSubmitted }: Props) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();

  const reset = useResetPassword();

  function handleSubmit() {
    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
      setEmailError(emailResult.message);
      return;
    }
    setEmailError(undefined);

    const cleanEmail = email.trim();
    reset.mutate(cleanEmail, {
      onSuccess: () => onSubmitted(cleanEmail),
    });
  }

  return (
    <View>
      <FormError message={reset.error ? (reset.error as Error).message : null} />

      <TextField
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        error={emailError}
      />

      <Button
        label="Send reset link"
        size="lg"
        loading={reset.isPending}
        onPress={handleSubmit}
        className="mt-6"
      />
    </View>
  );
}
