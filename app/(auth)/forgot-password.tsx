import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { FormInput } from "../../src/components/forms/form-input";
import { FormMessage } from "../../src/components/forms/form-message";
import { PrimaryButton } from "../../src/components/forms/primary-button";
import { Screen } from "../../src/components/ui/screen";
import { useForgotPasswordMutation } from "../../src/features/auth/hooks/use-auth-mutations";
import { validateEmail } from "../../src/features/auth/validation/auth-validation";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const forgotPasswordMutation = useForgotPasswordMutation();

  const handlePasswordReset = async () => {
    setFormError(null);
    setSuccessMessage(null);

    const emailError = validateEmail(email);
    setError(emailError);

    if (emailError) {
      return;
    }

    try {
      await forgotPasswordMutation.mutateAsync({ email: email.trim().toLowerCase() });
      setSuccessMessage("Password reset email sent. Please check your inbox.");
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : "Unable to send reset email.");
    }
  };

  return (
    <Screen contentClassName="justify-center">
      <Text className="text-3xl font-bold text-text">Reset password</Text>
      <Text className="mt-2 text-sm text-muted">We will send a reset link to your registered email.</Text>

      <View className="mt-8">
        {formError ? <FormMessage message={formError} /> : null}
        {successMessage ? <FormMessage message={successMessage} variant="success" /> : null}

        <FormInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="you@example.com"
          value={email}
          error={error}
        />

        <PrimaryButton
          label="Send reset link"
          loading={forgotPasswordMutation.isPending}
          onPress={handlePasswordReset}
        />

        <View className="mt-6">
          <Link className="text-sm text-primary" href="/(auth)/sign-in">
            Back to sign in
          </Link>
        </View>
      </View>
    </Screen>
  );
}
