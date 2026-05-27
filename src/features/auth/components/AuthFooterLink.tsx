import { Link, type Href } from 'expo-router';
import { View } from 'react-native';

import { Text } from '@/components/ui/Text';

type Props = {
  prompt: string;
  ctaLabel: string;
  href: Href;
};

export function AuthFooterLink({ prompt, ctaLabel, href }: Props) {
  return (
    <View className="mt-6 flex-row items-center justify-center">
      <Text variant="caption" tone="muted">
        {prompt}{' '}
      </Text>
      <Link href={href} asChild>
        <Text variant="caption" tone="brand" className="font-semibold">
          {ctaLabel}
        </Text>
      </Link>
    </View>
  );
}
