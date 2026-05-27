import { useState } from "react";
import { Link, useRouter } from "expo-router";

import { authService } from "@services/supabase";
import { AppButton, AppText, AppTextInput } from "@shared/components";

import { AuthScaffold } from "../components/AuthScaffold";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword, type AuthFormErrors } from "../utils/validation";

type LoginFields = "email" | "password";

export function LoginScreen() {
  const router = useRouter();
  const { errorMessage } = useAuth();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors<LoginFields>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const nextErrors: AuthFormErrors<LoginFields> = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    try {
      setFormError(null);
      setIsSubmitting(true);
      await authService.signIn({ email: email.trim(), password });
      router.replace("/");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScaffold
      description="Sign in to continue tracking workouts, programs, and progress."
      errorMessage={formError ?? errorMessage}
      title="Welcome back"
    >
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
        placeholder="Your password"
        secureTextEntry
        value={password}
      />
      <AppButton label="Sign in" loading={isSubmitting} onPress={handleSubmit} />
      <Link href="/forgot-password">
        <AppText className="text-center font-semibold text-primary" variant="caption">
          Forgot password?
        </AppText>
      </Link>
      <Link href="/register">
        <AppText className="text-center text-muted" variant="caption">
          New to GymBro? Create an account.
        </AppText>
      </Link>
    </AuthScaffold>
  );
}
