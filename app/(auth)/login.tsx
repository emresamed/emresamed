import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { AuthFooterLink } from '@/features/auth/components/AuthFooterLink';
import { AuthHeader } from '@/features/auth/components/AuthHeader';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginScreen() {
  return (
    <Screen scroll keyboardAvoiding contentClassName="px-6 pt-12 pb-8 justify-center">
      <View>
        <AuthHeader title="Welcome back" subtitle="Sign in to continue your training." />
        <LoginForm />
        <AuthFooterLink
          prompt="No account yet?"
          ctaLabel="Create one"
          href="/(auth)/register"
        />
      </View>
    </Screen>
  );
}
