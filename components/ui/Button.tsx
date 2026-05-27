import { ActivityIndicator, Pressable, PressableProps } from 'react-native';

import { cn } from '@/lib/utils';

import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary active:bg-primary-muted',
  secondary: 'bg-surface-elevated border border-border active:opacity-80',
  ghost: 'bg-transparent active:opacity-70',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-8 py-4',
};

const textVariantStyles: Record<ButtonVariant, string> = {
  primary: 'text-foreground font-semibold',
  secondary: 'text-foreground font-medium',
  ghost: 'text-primary font-medium',
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(
        'rounded-button items-center justify-center',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FAFAFA" />
      ) : (
        <Text className={textVariantStyles[variant]}>{title}</Text>
      )}
    </Pressable>
  );
}
