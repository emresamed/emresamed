import { View, ViewProps } from 'react-native';

import { cn } from '@/lib/utils';

interface CardProps extends ViewProps {
  className?: string;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn(
        'rounded-card border border-border bg-surface p-4',
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}
