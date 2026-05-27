import { View } from 'react-native';

import { Card, Screen, Text } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  return (
    <Screen scrollable contentClassName="px-4 pt-4">
      <Text variant="title">Profile</Text>
      <Text variant="body" className="mt-2 mb-6">
        Manage your account and training preferences.
      </Text>

      <Card className="mb-4">
        <Text variant="subtitle">Account</Text>
        <Text variant="body" className="mt-2">
          {isInitialized
            ? user?.email ?? 'Not signed in'
            : 'Loading session...'}
        </Text>
      </Card>

      <Card>
        <Text variant="subtitle">Authentication</Text>
        <Text variant="body" className="mt-2">
          Login and registration screens will be wired in Phase 2.
        </Text>
      </Card>
    </Screen>
  );
}
