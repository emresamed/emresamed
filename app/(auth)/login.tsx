import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  AuthLink,
  AuthScreenLayout,
  FormErrorBanner,
} from '@/components/auth';
import { Button, Input, PasswordInput } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useFormField } from '@/hooks/useFormField';
import {
  validateEmail,
  validatePassword,
} from '@/lib/validation/auth';

export default function LoginScreen() {
  const { signIn, isLoading } = useAuth();
  const emailField = useFormField();
  const passwordField = useFormField();
  const [formError, setFormError] = useState<string>();

  const handleSubmit = async () => {
    setFormError(undefined);

    const emailValidation = validateEmail(emailField.value);
    const passwordValidation = validatePassword(passwordField.value);

    emailField.setError(emailValidation.error);
    passwordField.setError(passwordValidation.error);

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      return;
    }

    try {
      await signIn({
        email: emailField.value,
        password: passwordField.value,
      });
      router.replace(ROUTES.tabs.home);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to sign in.');
    }
  };

  return (
    <AuthScreenLayout
      title="Welcome back"
      subtitle="Sign in to continue your training journey."
    >
      <View className="gap-4">
        <FormErrorBanner message={formError} />

        <Input
          label="Email"
          value={emailField.value}
          onChangeText={(text) => {
            emailField.setValue(text);
            emailField.setError(undefined);
          }}
          error={emailField.error}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          placeholder="you@example.com"
        />

        <PasswordInput
          label="Password"
          value={passwordField.value}
          onChangeText={(text) => {
            passwordField.setValue(text);
            passwordField.setError(undefined);
          }}
          error={passwordField.error}
          autoComplete="password"
          textContentType="password"
          placeholder="Enter your password"
        />

        <View className="items-end">
          <AuthLink href={ROUTES.auth.forgotPassword} label="Forgot password?" />
        </View>

        <Button title="Sign In" loading={isLoading} onPress={handleSubmit} />

        <View className="mt-2 flex-row items-center justify-center gap-1">
          <AuthLink href={ROUTES.auth.register} label="Create an account" />
        </View>
      </View>
    </AuthScreenLayout>
  );
}
