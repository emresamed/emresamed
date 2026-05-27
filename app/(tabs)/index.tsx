import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useAuth, useSignOut } from '@/features/auth';

/**
 * Temporary authenticated landing screen.
 * Lets us prove the auth round-trip works end to end.
 * Phase 4 replaces this with the real Home screen + Tabs.
 */
export default function HomePlaceholder() {
  const { user } = useAuth();
  const signOut = useSignOut();

  return (
    <Screen contentClassName="px-6 justify-center">
      <View>
        <Text variant="caption" tone="brand" className="uppercase tracking-widest">
          Signed in
        </Text>
        <Text variant="h1" className="mt-2">
          Hey {user?.user_metadata?.full_name ?? user?.email ?? 'athlete'}
        </Text>
        <Text variant="body" tone="muted" className="mt-2">
          Phase 2 auth is wired up. Phase 4 will replace this with your real home feed.
        </Text>

        <Button
          label="Sign out"
          variant="secondary"
          onPress={() => signOut.mutate()}
          loading={signOut.isPending}
          className="mt-8"
        />
      </View>
    </Screen>
  );
}
