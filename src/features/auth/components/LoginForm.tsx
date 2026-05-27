import { Link } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';

import { useSignIn } from '../hooks/useAuthMutations';
import { validateEmail, validatePassword } from '../validators';

import { FormError } from './FormError';

type FieldErrors = { email?: string; password?: string };

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const signIn = useSignIn();

  function handleSubmit() {
    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);

    const next: FieldErrors = {};
    if (!emailResult.valid) next.email = emailResult.message;
    if (!passwordResult.valid) next.password = passwordResult.message;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    signIn.mutate({ email: email.trim(), password });
  }

  return (
    <View>
      <FormError message={signIn.error ? (signIn.error as Error).message : null} />

      <View className="gap-4">
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
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          error={errors.password}
        />
      </View>

      <Link href="/(auth)/forgot-password" asChild>
        <Text variant="caption" tone="brand" className="mt-3 self-end font-semibold">
          Forgot password?
        </Text>
      </Link>

      <Button
        label="Sign in"
        size="lg"
        loading={signIn.isPending}
        onPress={handleSubmit}
        className="mt-6"
      />
    </View>
  );
}
