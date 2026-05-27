import { useState } from "react";
import { Link } from "expo-router";

import { authService } from "@services/supabase";
import { AppButton, AppText, AppTextInput } from "@shared/components";

import { AuthScaffold } from "../components/AuthScaffold";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, type AuthFormErrors } from "../utils/validation";

type ForgotPasswordFields = "email";

export function ForgotPasswordScreen() {
  const { errorMessage } = useAuth();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors<ForgotPasswordFields>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    const nextErrors: AuthFormErrors<ForgotPasswordFields> = {
      email: validateEmail(email),
    };

    setErrors(nextErrors);

    if (nextErrors.email) {
      return;
    }

    try {
      setFormError(null);
      setSuccessMessage(null);
      setIsSubmitting(true);
      await authService.resetPassword(email.trim());
      setSuccessMessage("Password reset instructions have been sent to your email.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to send reset instructions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthScaffold
      description="Enter your email and we will send password reset instructions."
      errorMessage={formError ?? errorMessage}
      title="Reset password"
    >
      {successMessage ? (
        <AppText className="rounded-2xl bg-success/10 p-3 text-success" variant="caption">
          {successMessage}
        </AppText>
      ) : null}
      <AppTextInput
        autoComplete="email"
        error={errors.email}
        keyboardType="email-address"
        label="Email"
        onChangeText={setEmail}
        placeholder="you@example.com"
        value={email}
      />
      <AppButton label="Send reset link" loading={isSubmitting} onPress={handleSubmit} />
      <Link href="/login">
        <AppText className="text-center text-muted" variant="caption">
          Back to sign in.
        </AppText>
      </Link>
    </AuthScaffold>
  );
}
