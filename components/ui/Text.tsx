import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { cn } from '@/lib/utils';

type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  title: 'text-3xl font-bold text-foreground',
  subtitle: 'text-xl font-semibold text-foreground',
  body: 'text-base text-foreground-secondary',
  caption: 'text-sm text-muted',
  label: 'text-sm font-medium text-foreground',
};

export function Text({ variant = 'body', className, ...props }: TextProps) {
  return <RNText className={cn(variantStyles[variant], className)} {...props} />;
}
