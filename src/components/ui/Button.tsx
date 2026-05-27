import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';

import { colors } from '@/theme';
import { cn } from '@/utils/cn';

import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
};

const BASE = 'flex-row items-center justify-center rounded-lg';

const SIZE: Record<Size, string> = {
  md: 'h-11 px-4',
  lg: 'h-14 px-6',
};

const VARIANT: Record<Variant, { container: string; pressed: string; spinner: string }> = {
  primary: {
    container: 'bg-brand',
    pressed: 'bg-brand-pressed',
    spinner: colors.text.inverse,
  },
  secondary: {
    container: 'bg-surface border border-border',
    pressed: 'bg-surface-hover',
    spinner: colors.text.DEFAULT,
  },
  ghost: {
    container: 'bg-transparent',
    pressed: 'bg-surface',
    spinner: colors.text.DEFAULT,
  },
};

/**
 * Single-purpose button with three variants. Loading hides the label and shows
 * a spinner — never both at once — so layout never jumps.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  fullWidth = true,
  leftIcon,
  rightIcon,
  className,
  ...rest
}: ButtonProps) {
  const v = VARIANT[variant];
  const isInactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      disabled={isInactive}
      {...rest}
    >
      {({ pressed }) => (
        <View
          className={cn(
            BASE,
            SIZE[size],
            v.container,
            pressed && !isInactive && v.pressed,
            isInactive && 'opacity-50',
            fullWidth && 'w-full',
            className,
          )}
        >
          {loading ? (
            <ActivityIndicator color={v.spinner} />
          ) : (
            <>
              {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
              <Text
                variant="bodyStrong"
                tone={variant === 'primary' ? 'inverse' : 'default'}
              >
                {label}
              </Text>
              {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
            </>
          )}
        </View>
      )}
    </Pressable>
  );
}
