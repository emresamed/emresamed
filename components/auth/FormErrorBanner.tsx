import { View } from 'react-native';

import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

interface FormErrorBannerProps {
  message?: string;
  className?: string;
}

export function FormErrorBanner({ message, className }: FormErrorBannerProps) {
  if (!message) return null;

  return (
    <View className={cn('rounded-button border border-error/30 bg-error/10 px-4 py-3', className)}>
      <Text variant="caption" className="text-error">
        {message}
      </Text>
    </View>
  );
}
