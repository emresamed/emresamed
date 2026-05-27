import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { AuthFooterLink } from '@/features/auth/components/AuthFooterLink';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterScreen() {
  const router = useRouter();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  if (pendingEmail) {
    return (
      <Screen contentClassName="px-6 justify-center">
        <View>
          <AuthHeader
            title="Check your inbox"
            subtitle={`We sent a verification link to ${pendingEmail}. Open it to activate your account.`}
          />
          <Button label="Back to sign in" onPress={() => router.replace('/(auth)/login')} />
          <Text variant="caption" tone="subtle" className="mt-4 text-center">
            Didn't get it? Check spam, then try again later.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll keyboardAvoiding contentClassName="px-6 pt-12 pb-8 justify-center">
      <View>
        <AuthHeader title="Create your account" subtitle="Track workouts. Hit PRs. Stay consistent." />
        <RegisterForm onSuccessNeedsVerification={setPendingEmail} />
        <AuthFooterLink
          prompt="Already have an account?"
          ctaLabel="Sign in"
          href="/(auth)/login"
        />
      </View>
    </Screen>
  );
}
