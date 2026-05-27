import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

type Props = {
  title: string;
  subtitle?: string;
};

export function AuthHeader({ title, subtitle }: Props) {
  return (
    <View className="mb-8">
      <Text variant="caption" tone="brand" className="mb-2 uppercase tracking-widest">
        GymBro
      </Text>
      <Text variant="h1">{title}</Text>
      {subtitle ? (
        <Text variant="body" tone="muted" className="mt-2">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
