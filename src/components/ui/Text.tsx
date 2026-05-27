import { forwardRef } from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { typography, type TypographyVariant } from '@/theme';
import { cn } from '@/utils/cn';

type ToneKey = 'default' | 'muted' | 'subtle' | 'inverse' | 'brand' | 'danger' | 'success';

const TONE_CLASS: Record<ToneKey, string> = {
  default: 'text-text',
  muted: 'text-text-muted',
  subtle: 'text-text-subtle',
  inverse: 'text-text-inverse',
  brand: 'text-brand',
  danger: 'text-accent',
  success: 'text-accent-success',
};

export type TextProps = RNTextProps & {
  variant?: TypographyVariant;
  tone?: ToneKey;
  className?: string;
};

/**
 * Single typography primitive. All text in the app flows through here so we
 * never sprinkle ad-hoc font sizes in screens. Sizes/weights come from the theme.
 */
export const Text = forwardRef<RNText, TextProps>(
  ({ variant = 'body', tone = 'default', className, style, ...rest }, ref) => {
    const t = typography[variant];
    return (
      <RNText
        ref={ref}
        className={cn(TONE_CLASS[tone], className)}
        style={[
          { fontSize: t.size, lineHeight: t.size * t.lineHeight, fontWeight: t.weight },
          style,
        ]}
        {...rest}
      />
    );
  },
);

Text.displayName = 'Text';
