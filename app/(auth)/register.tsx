import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  AuthLink,
  AuthScreenLayout,
  FormErrorBanner,
  FormSuccessBanner,
} from '@/components/auth';
import { Button, Input, PasswordInput } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useFormField } from '@/hooks/useFormField';
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from '@/lib/validation/auth';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterScreen() {
  const { signUp, isLoading } = useAuth();
  const fullNameField = useFormField();
  const emailField = useFormField();
  const passwordField = useFormField();
  const confirmPasswordField = useFormField();
  const [formError, setFormError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const handleSubmit = async () => {
    setFormError(undefined);
    setSuccessMessage(undefined);

    const fullNameValidation = validateFullName(fullNameField.value);
    const emailValidation = validateEmail(emailField.value);
    const passwordValidation = validatePassword(passwordField.value);
    const confirmPasswordValidation = validateConfirmPassword(
      passwordField.value,
      confirmPasswordField.value,
    );

    fullNameField.setError(fullNameValidation.error);
    emailField.setError(emailValidation.error);
    passwordField.setError(passwordValidation.error);
    confirmPasswordField.setError(confirmPasswordValidation.error);

    if (
      !fullNameValidation.isValid ||
      !emailValidation.isValid ||
      !passwordValidation.isValid ||
      !confirmPasswordValidation.isValid
    ) {
      return;
    }

    try {
      await signUp({
        fullName: fullNameField.value,
        email: emailField.value,
        password: passwordField.value,
      });

      if (useAuthStore.getState().session) {
        router.replace(ROUTES.tabs.home);
        return;
      }

      setSuccessMessage(
        'Account created. Check your email to confirm, then sign in.',
      );
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to create account.');
    }
  };

  return (
    <AuthScreenLayout
      title="Create account"
      subtitle="Join GymBro and start building your best self."
    >
      <View className="gap-4">
        <FormErrorBanner message={formError} />
        <FormSuccessBanner message={successMessage} />

        <Input
          label="Full name"
          value={fullNameField.value}
          onChangeText={(text) => {
            fullNameField.setValue(text);
            fullNameField.setError(undefined);
          }}
          error={fullNameField.error}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          placeholder="John Doe"
        />

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
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder="At least 6 characters"
        />

        <PasswordInput
          label="Confirm password"
          value={confirmPasswordField.value}
          onChangeText={(text) => {
            confirmPasswordField.setValue(text);
            confirmPasswordField.setError(undefined);
          }}
          error={confirmPasswordField.error}
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder="Repeat your password"
        />

        <Button title="Create Account" loading={isLoading} onPress={handleSubmit} />

        <View className="mt-2 flex-row items-center justify-center gap-1">
          <AuthLink
            href={ROUTES.auth.login}
            label="Already have an account? Sign in"
          />
        </View>

        {successMessage ? (
          <Button
            title="Go to Sign In"
            variant="secondary"
            onPress={() => router.replace(ROUTES.auth.login)}
          />
        ) : null}
      </View>
    </AuthScreenLayout>
  );
}
