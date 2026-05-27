import { useState } from "react";
import { Link, useRouter } from "expo-router";

import { authService } from "@services/supabase";
import { AppButton, AppText, AppTextInput } from "@shared/components";

import { AuthScaffold } from "../components/AuthScaffold";
import { useAuth } from "../hooks/useAuth";
import {
  validateEmail,
  validateFullName,
  validatePassword,
  type AuthFormErrors,
} from "../utils/validation";

type RegisterFields = "email" | "fullName" | "password";

export function RegisterScreen() {
  const router = useRouter();
  const { errorMessage } = useAuth();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors<RegisterFields>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const nextErrors: AuthFormErrors<RegisterFields> = {
      email: validateEmail(email),
      fullName: validateFullName(fullName),
      password: validatePassword(password),
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.fullName || nextErrors.password) {
      return;
    }

    try {
      setFormError(null);
      setIsSubmitting(true);
      await authService.register({
        email: email.trim(),
        fullName: fullName.trim(),
        password,
      });
      router.replace("/");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScaffold
      description="Create your athlete profile and start building your training history."
      errorMessage={formError ?? errorMessage}
      title="Create account"
    >
      <AppTextInput
        autoComplete="name"
        error={errors.fullName}
        label="Full name"
        onChangeText={setFullName}
        placeholder="Alex Carter"
        value={fullName}
      />
      <AppTextInput
        autoComplete="email"
        error={errors.email}
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      <AppTextInput
        error={errors.password}
        label="Password"
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        secureTextEntry
        value={password}
      />
      <AppButton label="Create account" loading={isSubmitting} onPress={handleSubmit} />
      <Link href="/login">
        <AppText className="text-center text-muted" variant="caption">
          Already have an account? Sign in.
        </AppText>
      </Link>
    </AuthScaffold>
  );
}
