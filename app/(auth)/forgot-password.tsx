import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  AuthLink,
  AuthScreenLayout,
  FormErrorBanner,
  FormSuccessBanner,
} from '@/components/auth';
import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useFormField } from '@/hooks/useFormField';
import { validateEmail } from '@/lib/validation/auth';

export default function ForgotPasswordScreen() {
  const { resetPassword, isLoading } = useAuth();
  const emailField = useFormField();
  const [formError, setFormError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const handleSubmit = async () => {
    setFormError(undefined);
    setSuccessMessage(undefined);

    const emailValidation = validateEmail(emailField.value);
    emailField.setError(emailValidation.error);

    if (!emailValidation.isValid) {
      return;
    }

    try {
      await resetPassword(emailField.value);
      setSuccessMessage(
        'If an account exists for this email, a reset link has been sent.',
      );
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to send reset email.',
      );
    }
  };

  return (
    <AuthScreenLayout
      title="Reset password"
      subtitle="Enter your email and we will send you a reset link."
    >
      <View className="gap-4">
        <FormErrorBanner message={formError} />
        <FormSuccessBanner message={successMessage} />

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

        <Button title="Send Reset Link" loading={isLoading} onPress={handleSubmit} />

        <View className="mt-2 flex-row items-center justify-center gap-1">
          <AuthLink href={ROUTES.auth.login} label="Back to sign in" />
        </View>

        {successMessage ? (
          <Button
            title="Return to Sign In"
            variant="secondary"
            onPress={() => router.replace(ROUTES.auth.login)}
          />
        ) : null}
      </View>
    </AuthScreenLayout>
  );
}
