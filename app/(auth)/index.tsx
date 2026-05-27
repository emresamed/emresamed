import { Text, View } from 'react-native';

/**
 * Placeholder auth landing screen.
 * Replaced in Phase 2 with the real login flow.
 */
export default function AuthPlaceholder() {
  return (
    <View className="flex-1 items-center justify-center bg-bg px-6">
      <Text className="text-3xl font-bold text-text">GymBro</Text>
      <Text className="mt-2 text-text-muted">Phase 1 foundation ready.</Text>
    </View>
  );
}
