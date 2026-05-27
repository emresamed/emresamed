import { View } from 'react-native';

import { Screen, Text } from '@/components/ui';

export default function RegisterScreen() {
  return (
    <Screen contentClassName="flex-1 items-center justify-center px-6">
      <View className="items-center">
        <Text variant="title">Create Account</Text>
        <Text variant="body" className="mt-2 text-center">
          Registration flow will be implemented in Phase 2.
        </Text>
      </View>
    </Screen>
  );
}
