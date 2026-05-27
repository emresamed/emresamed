import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { TextField } from "@/components/forms/TextField";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { AuthFormContainer } from "@/features/auth/components/AuthFormContainer";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import type { FieldErrors, ForgotPasswordFormValues } from "@/features/auth/types";
import { hasValidationErrors, validateForgotPassword } from "@/features/auth/utils/validation";
import { routes } from "@/navigation/routes";

const initialValues: ForgotPasswordFormValues = {
  email: ""
};

export default function ForgotPasswordScreen() {
  const [errors, setErrors] = useState<FieldErrors<ForgotPasswordFormValues>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [values, setValues] = useState(initialValues);
  const { error, isLoading, requestPasswordReset } = useAuthActions();

  async function handleSubmit() {
    const nextErrors = validateForgotPassword(values);
    setErrors(nextErrors);
    setSuccessMessage(null);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    const result = await requestPasswordReset(values);

    if (result !== null) {
      setSuccessMessage("If an account exists for this email, a reset link has been sent.");
      setValues(initialValues);
    }
  }

  return (
    <AuthFormContainer
      title="Reset password"
      subtitle="Enter your email and we will send instructions to help you regain access."
      footer={
        <Link href={routes.auth.login} asChild>
          <Pressable className="px-4 py-3">
            <AppText variant="caption" className="text-primary-soft">
              Back to login
            </AppText>
          </Pressable>
        </Link>
      }
    >
      <View className="gap-4">
        <TextField
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          error={errors.email}
          keyboardType="email-address"
          label="Email"
          onChangeText={(email) => setValues({ email })}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={values.email}
        />
      </View>

      {error ? <StatusMessage message={error} /> : null}
      {successMessage ? <StatusMessage message={successMessage} variant="success" /> : null}

      <Button label="Send reset link" loading={isLoading} onPress={handleSubmit} />
    </AuthFormContainer>
  );
}
