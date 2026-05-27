import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { Button, Input } from '@/components/common';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import { Validation } from '@/utils/validation';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const { sendResetEmail, isLoading, isSuccess, error, reset } = useForgotPassword();

  function handleSubmit() {
    if (!Validation.isValidEmail(email)) {
      setEmailError('Enter a valid email address.');
      return;
    }
    setEmailError('');
    reset();
    sendResetEmail(email.trim().toLowerCase());
  }

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Mail size={48} color={Colors.primary} />
          </View>
          <Text style={styles.successTitle}>Email sent!</Text>
          <Text style={styles.successBody}>
            We sent a password reset link to{'\n'}
            <Text style={styles.successEmail}>{email.trim().toLowerCase()}</Text>.
            {'\n\n'}
            Check your inbox and follow the instructions.
          </Text>
          <Button
            label="Back to Sign In"
            onPress={() => router.replace('/(auth)/login')}
            style={styles.successBtn}
          />
          <Button
            label="Resend Email"
            variant="ghost"
            onPress={() => sendResetEmail(email.trim().toLowerCase())}
            loading={isLoading}
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

          {/* Icon */}
          <View style={styles.iconBlock}>
            <View style={styles.iconCircle}>
              <Mail size={36} color={Colors.primary} />
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Forgot password?</Text>
            <Text style={styles.subtitle}>
              No worries. Enter your email and we'll send you a reset link.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Input
              label="Email"
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (emailError) setEmailError('');
                if (error) reset();
              }}
              placeholder="you@example.com"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              error={emailError}
            />

            {error && (
              <View style={styles.serverError}>
                <Text style={styles.serverErrorText}>{error.message}</Text>
              </View>
            )}

            <Button
              label="Send Reset Link"
              onPress={handleSubmit}
              loading={isLoading}
              style={styles.submitBtn}
            />
          </View>

          {/* Footer */}
          <TouchableOpacity
            style={styles.footer}
            onPress={() => router.back()}
          >
            <Text style={styles.footerText}>Remember your password? </Text>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
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

  iconBlock: {
    alignItems: 'center',
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing.base,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleBlock: {
    paddingBottom: Spacing.xl,
    gap: 8,
  },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    gap: Spacing.md,
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

  // Success
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
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
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
    width: '100%',
  },
});
