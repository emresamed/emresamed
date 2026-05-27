import { Link } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { FormInput } from "../../src/components/forms/form-input";
import { FormMessage } from "../../src/components/forms/form-message";
import { PrimaryButton } from "../../src/components/forms/primary-button";
import { Screen } from "../../src/components/ui/screen";
import { useSignUpMutation } from "../../src/features/auth/hooks/use-auth-mutations";
import {
  hasAuthErrors,
  validateSignUpFields,
  type AuthFieldErrors
} from "../../src/features/auth/validation/auth-validation";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  const signUpMutation = useSignUpMutation();

  const handleSignUp = async () => {
    setFormError(null);

    const validationErrors = validateSignUpFields({ email, password, confirmPassword });
    setErrors(validationErrors);

    if (hasAuthErrors(validationErrors)) {
      return;
    }

    try {
      await signUpMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        password
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create account.");
    }
  };

  return (
    <Screen contentClassName="justify-center">
      <Text className="text-3xl font-bold text-text">Create your account</Text>
      <Text className="mt-2 text-sm text-muted">Start building your GymBro progress timeline.</Text>

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
          autoComplete="new-password"
          label="Password"
          onChangeText={setPassword}
          placeholder="At least 8 characters"
          secureTextEntry
          value={password}
          error={errors.password}
        />

        <FormInput
          autoCapitalize="none"
          autoComplete="new-password"
          label="Confirm Password"
          onChangeText={setConfirmPassword}
          placeholder="Repeat password"
          secureTextEntry
          value={confirmPassword}
          error={errors.confirmPassword}
        />

        <PrimaryButton label="Create account" loading={signUpMutation.isPending} onPress={handleSignUp} />

        <View className="mt-6 gap-2">
          <Link className="text-sm text-primary" href="/(auth)/sign-in">
            Already have an account? Sign in
          </Link>
        </View>
      </View>
    </Screen>
  );
}
