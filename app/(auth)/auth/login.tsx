import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import { TextField } from "@/components/forms/TextField";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { AuthFormContainer } from "@/features/auth/components/AuthFormContainer";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import type { FieldErrors, LoginFormValues } from "@/features/auth/types";
import { hasValidationErrors, validateLogin } from "@/features/auth/utils/validation";
import { routes } from "@/navigation/routes";

const initialValues: LoginFormValues = {
  email: "",
  password: ""
};

export default function LoginScreen() {
  const [errors, setErrors] = useState<FieldErrors<LoginFormValues>>({});
  const [values, setValues] = useState(initialValues);
  const { error, isLoading, signIn } = useAuthActions();

  async function handleSubmit() {
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    await signIn(values);
  }

  return (
    <AuthFormContainer
      title="Welcome back"
      subtitle="Log in to track workouts, save exercises, and keep your training plan moving."
      footer={
        <Link href={routes.auth.register} asChild>
          <Pressable className="px-4 py-3">
            <AppText variant="caption" className="text-slate-300">
              New to GymBro? <AppText className="text-primary-soft">Create an account</AppText>
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
          onChangeText={(email) => setValues((current) => ({ ...current, email }))}
          placeholder="you@example.com"
          textContentType="emailAddress"
          value={values.email}
        />
        <TextField
          autoCapitalize="none"
          autoComplete="password"
          error={errors.password}
          label="Password"
          onChangeText={(password) => setValues((current) => ({ ...current, password }))}
          placeholder="Enter your password"
          secureTextEntry
          textContentType="password"
          value={values.password}
        />
      </View>

      <Link href={routes.auth.forgotPassword} asChild>
        <Pressable className="self-end py-1">
          <AppText variant="caption" className="text-primary-soft">
            Forgot password?
          </AppText>
        </Pressable>
      </Link>

      {error ? <StatusMessage message={error} /> : null}

      <Button label="Log in" loading={isLoading} onPress={handleSubmit} />
    </AuthFormContainer>
  );
}
