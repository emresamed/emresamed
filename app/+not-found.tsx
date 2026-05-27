import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

import { Screen, Text } from '@/components/ui';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <Screen contentClassName="flex-1 items-center justify-center px-6">
        <Text variant="title">Page not found</Text>
        <Link href="/" className="mt-4">
          <Text variant="label" className="text-primary">
            Go to Home
          </Text>
        </Link>
      </Screen>
    </>
  );
}
