import { ScrollView, View, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';

interface ScreenProps extends ViewProps {
  scrollable?: boolean;
  className?: string;
  contentClassName?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export function Screen({
  children,
  scrollable = false,
  className,
  contentClassName,
  edges = ['top', 'bottom'],
  ...props
}: ScreenProps) {
  const content = scrollable ? (
    <ScrollView
      className={cn('flex-1', contentClassName)}
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={cn('flex-1', contentClassName)} {...props}>
      {children}
    </View>
  );

  return (
    <SafeAreaView className={cn('flex-1 bg-background', className)} edges={edges}>
      {content}
    </SafeAreaView>
  );
}
