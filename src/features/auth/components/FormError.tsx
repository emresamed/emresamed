import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

type Props = { message?: string | null };

/**
 * Top-of-form error banner. Used for server / network errors that aren't tied
 * to a single field (per-field errors stay on the TextField itself).
 */
export function FormError({ message }: Props) {
  if (!message) return null;
  return (
    <View className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2.5">
      <Text variant="caption" tone="danger">
        {message}
      </Text>
    </View>
  );
}
