import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import { Button, Input } from '@/components/common';
import { useSignUp } from '@/hooks/useSignUp';
import { validateSignUp, Validation } from '@/utils/validation';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const confirmRef = useRef<RNTextInput>(null);

  const { signUp, isLoading, isSuccess, error, reset } = useSignUp();

  function handleSubmit() {
    const errors = validateSignUp(email, password, fullName);

    if (password !== confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match.' });
    }

    if (errors.length > 0) {
      const map: Record<string, string> = {};
      errors.forEach((e) => (map[e.field] = e.message));
      setFieldErrors(map);
      return;
    }

    setFieldErrors({});
    reset();
    signUp({ email: email.trim().toLowerCase(), password, fullName: fullName.trim() });
  }

  // Email confirmation screen shown after successful sign-up
  if (isSuccess) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <CheckCircle size={52} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Check your email</Text>
          <Text style={styles.successBody}>
            We sent a confirmation link to{' '}
            <Text style={styles.successEmail}>{email.trim().toLowerCase()}</Text>.
            {'\n\n'}
            Tap the link to activate your account, then sign in.
          </Text>
          <Button
            label="Go to Sign In"
            onPress={() => router.replace('/(auth)/login')}
            style={styles.successBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ArrowLeft size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Start your fitness journey today</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <View style={styles.fields}>
              <Input
                label="Full Name"
                value={fullName}
                onChangeText={(v) => {
                  setFullName(v);
                  if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: '' }));
                }}
                placeholder="Alex Johnson"
                textContentType="name"
                autoComplete="name"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                error={fieldErrors.fullName}
              />

              <Input
                ref={emailRef}
                label="Email"
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }));
                }}
                placeholder="you@example.com"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                error={fieldErrors.email}
              />

              <Input
                ref={passwordRef}
                label="Password"
                value={password}
                onChangeText={(v) => {
                  setPassword(v);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }));
                }}
                placeholder="Min. 8 characters"
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
                returnKeyType="next"
                onSubmitEditing={() => confirmRef.current?.focus()}
                error={fieldErrors.password}
                hint={!fieldErrors.password && password.length > 0 && password.length < 8
                  ? `${8 - password.length} more characters needed`
                  : undefined}
              />

              <Input
                ref={confirmRef}
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(v) => {
                  setConfirmPassword(v);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((p) => ({ ...p, confirmPassword: '' }));
                  }
                }}
                placeholder="••••••••"
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                error={fieldErrors.confirmPassword}
              />
            </View>

            {/* Server error */}
            {error && (
              <View style={styles.serverError}>
                <Text style={styles.serverErrorText}>{friendlyError(error.message)}</Text>
              </View>
            )}

            <Button
              label="Create Account"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitBtn}
            />

            <Text style={styles.terms}>
              By creating an account you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function friendlyError(message: string): string {
  if (message.toLowerCase().includes('already registered')) {
    return 'An account with this email already exists.';
  }
  if (message.toLowerCase().includes('password')) {
    return 'Password must be at least 8 characters.';
  }
  return message;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing['2xl'],
  },

  header: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceElevated,
  },

  titleBlock: {
    paddingVertical: Spacing.lg,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.md,
  },
  fields: {
    gap: Spacing.base,
  },

  serverError: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: Spacing.md,
  },
  serverErrorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },

  submitBtn: {
    marginTop: Spacing.sm,
  },

  terms: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },

  // Success state
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.base,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  successTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  successBody: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  successEmail: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  successBtn: {
    marginTop: Spacing.lg,
  },
});
