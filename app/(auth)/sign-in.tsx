import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { FormInput } from "../../src/components/forms/form-input";
import { FormMessage } from "../../src/components/forms/form-message";
import { PrimaryButton } from "../../src/components/forms/primary-button";
import { Screen } from "../../src/components/ui/screen";
import { useSignInMutation } from "../../src/features/auth/hooks/use-auth-mutations";
import {
  hasAuthErrors,
  validateSignInFields,
  type AuthFieldErrors
} from "../../src/features/auth/validation/auth-validation";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const signInMutation = useSignInMutation();

  const handleSignIn = async () => {
    setFormError(null);

    const validationErrors = validateSignInFields({ email, password });
    setErrors(validationErrors);

    if (hasAuthErrors(validationErrors)) {
      return;
    }

    try {
      await signInMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        password
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to sign in.");
    }
  };

  return (
    <Screen contentClassName="justify-center">
      <Text className="text-3xl font-bold text-text">Welcome back</Text>
      <Text className="mt-2 text-sm text-muted">Sign in to continue your training journey.</Text>

      <View className="mt-8">
        {formError ? <FormMessage message={formError} /> : null}

        <FormInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="you@example.com"
          value={email}
          error={errors.email}
        />

        <FormInput
          autoCapitalize="none"
          autoComplete="password"
          label="Password"
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          error={errors.password}
        />

        <PrimaryButton label="Sign in" loading={signInMutation.isPending} onPress={handleSignIn} />

        <View className="mt-6 gap-2">
          <Link className="text-sm text-primary" href="/(auth)/forgot-password">
            Forgot your password?
          </Link>
          <Link className="text-sm text-primary" href="/(auth)/sign-up">
            No account yet? Create one
          </Link>
        </View>
      </View>
    </Screen>
  );
}
