import { View } from 'react-native';

import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FormSuccessBannerProps {
  message?: string;
  className?: string;
}

export function FormSuccessBanner({ message, className }: FormSuccessBannerProps) {
  if (!message) return null;

  return (
    <View
      className={cn('rounded-button border border-success/30 bg-success/10 px-4 py-3', className)}
    >
      <Text variant="caption" className="text-success">
        {message}
      </Text>
    </View>
  );
}
