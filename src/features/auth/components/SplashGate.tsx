import { ActivityIndicator, View } from 'react-native';

import { colors } from '@/theme';

/**
 * Shown for the brief moment between app launch and the auth listener
 * resolving the cached session. Prevents the "login flash" anti-pattern.
 */
export function SplashGate() {
  return (
    <View className="flex-1 items-center justify-center bg-bg">
      <ActivityIndicator color={colors.brand.DEFAULT} />
    </View>
  );
}
