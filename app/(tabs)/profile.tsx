import { View } from 'react-native';

import { Button, Card, Screen, Text } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { user, signOut, isLoading } = useAuth();

  const fullName = user?.user_metadata?.full_name as string | undefined;
  const displayName = fullName || user?.email || 'GymBro member';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Screen scrollable contentClassName="px-4 pt-4">
      <Text variant="title">Profile</Text>
      <Text variant="body" className="mt-2 mb-6">
        Manage your account and training preferences.
      </Text>

      <Card className="mb-4">
        <Text variant="subtitle">{displayName}</Text>
        <Text variant="body" className="mt-2">
          {user?.email}
        </Text>
      </Card>

      <Card className="mb-6">
        <Text variant="subtitle">Account</Text>
        <Text variant="body" className="mt-2">
          Your session is secured with Supabase authentication.
        </Text>
      </Card>

      <Button
        title="Sign Out"
        variant="secondary"
        loading={isLoading}
        onPress={handleSignOut}
      />

      <View className="h-4" />
    </Screen>
  );
}
