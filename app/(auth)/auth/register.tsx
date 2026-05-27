import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { TextField } from "@/components/forms/TextField";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { AuthFormContainer } from "@/features/auth/components/AuthFormContainer";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import type { FieldErrors, RegisterFormValues } from "@/features/auth/types";
import { hasValidationErrors, validateRegister } from "@/features/auth/utils/validation";
import { routes } from "@/navigation/routes";

const initialValues: RegisterFormValues = {
  confirmPassword: "",
  email: "",
  fullName: "",
  password: ""
};

export default function RegisterScreen() {
  const [errors, setErrors] = useState<FieldErrors<RegisterFormValues>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [values, setValues] = useState(initialValues);
  const { error, isLoading, signUp } = useAuthActions();

  async function handleSubmit() {
    const nextErrors = validateRegister(values);
    setErrors(nextErrors);
    setSuccessMessage(null);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    const result = await signUp(values);

    if (result?.user && !result.session) {
      setSuccessMessage("Account created. Check your email to confirm your account before logging in.");
      setValues(initialValues);
    }
  }

  return (
    <AuthFormContainer
      title="Create account"
      subtitle="Start building a consistent workout history with a secure GymBro account."
      footer={
        <Link href={routes.auth.login} asChild>
          <Pressable className="px-4 py-3">
            <AppText variant="caption" className="text-slate-300">
              Already have an account? <AppText className="text-primary-soft">Log in</AppText>
            </AppText>
          </Pressable>
        </Link>
      }
    >
      <View className="gap-4">
        <TextField
          autoCapitalize="words"
          autoComplete="name"
          error={errors.fullName}
          label="Full name"
          onChangeText={(fullName) => setValues((current) => ({ ...current, fullName }))}
          placeholder="Alex Johnson"
          textContentType="name"
          value={values.fullName}
        />
        <TextField
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          error={errors.email}
          keyboardType="email-address"
          label="Email"
          onChangeText={(email) => setValues((current) => ({ ...current, email }))}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={values.email}
        />
        <TextField
          autoCapitalize="none"
          autoComplete="new-password"
          error={errors.password}
          label="Password"
          onChangeText={(password) => setValues((current) => ({ ...current, password }))}
          placeholder="At least 8 characters"
          secureTextEntry
          textContentType="newPassword"
          value={values.password}
        />
        <TextField
          autoCapitalize="none"
          autoComplete="new-password"
          error={errors.confirmPassword}
          label="Confirm password"
          onChangeText={(confirmPassword) =>
            setValues((current) => ({ ...current, confirmPassword }))
          }
          placeholder="Repeat your password"
          secureTextEntry
          textContentType="newPassword"
          value={values.confirmPassword}
        />
      </View>

      {error ? <StatusMessage message={error} /> : null}
      {successMessage ? <StatusMessage message={successMessage} variant="success" /> : null}

      <Button label="Create account" loading={isLoading} onPress={handleSubmit} />
    </AuthFormContainer>
  );
}
