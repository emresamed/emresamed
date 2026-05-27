import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';

import { useSignUp } from '../hooks/useAuthMutations';
import { validateEmail, validateName, validatePassword } from '../validators';

import { FormError } from './FormError';

type FieldErrors = { fullName?: string; email?: string; password?: string };

type Props = {
  onSuccessNeedsVerification: (email: string) => void;
};

export function RegisterForm({ onSuccessNeedsVerification }: Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const signUp = useSignUp();

  function handleSubmit() {
    const nameResult = validateName(fullName);
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);

    const next: FieldErrors = {};
    if (!nameResult.valid) next.fullName = nameResult.message;
    if (!emailResult.valid) next.email = emailResult.message;
    if (!passwordResult.valid) next.password = passwordResult.message;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    signUp.mutate(
      { fullName: fullName.trim(), email: email.trim(), password },
      {
        onSuccess: (data) => {
          // If Supabase email-confirmation is enabled, session is null until verified.
          if (!data.session) onSuccessNeedsVerification(email.trim());
          // If confirmation is OFF, the auth listener will route the user automatically.
        },
      },
    );
  }

  return (
    <View>
      <FormError message={signUp.error ? (signUp.error as Error).message : null} />

      <View className="gap-4">
        <TextField
          label="Full name"
          placeholder="Alex Carter"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          error={errors.fullName}
        />

        <TextField
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          error={errors.email}
        />

        <TextField
          label="Password"
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          error={errors.password}
          helperText={errors.password ? undefined : 'Minimum 8 characters'}
        />
      </View>

      <Button
        label="Create account"
        size="lg"
        loading={signUp.isPending}
        onPress={handleSubmit}
        className="mt-6"
      />
    </View>
  );
}
