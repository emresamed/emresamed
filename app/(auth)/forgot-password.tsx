import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { AuthFooterLink } from '@/features/auth/components/AuthFooterLink';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo) {
    return (
      <Screen contentClassName="px-6 justify-center">
        <View>
          <AuthHeader
            title="Check your inbox"
            subtitle={`If an account exists for ${sentTo}, you'll receive a reset link shortly.`}
          />
          <Button label="Back to sign in" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll keyboardAvoiding contentClassName="px-6 pt-12 pb-8 justify-center">
      <View>
        <AuthHeader
          title="Reset password"
          subtitle="Enter the email associated with your account and we'll send you a reset link."
        />
        <ForgotPasswordForm onSubmitted={setSentTo} />
        <AuthFooterLink
          prompt="Remembered it?"
          ctaLabel="Sign in"
          href="/(auth)/login"
        />
      </View>
    </Screen>
  );
}
