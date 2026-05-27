import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { Colors, BorderRadius, FontSize, FontWeight } from '@/constants';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  label,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  size = 'md',
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? Colors.white : Colors.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`], styles[`${size}Label`]]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  danger: {
    backgroundColor: Colors.error,
  },

  // Sizes
  sm: { height: 40, paddingHorizontal: 16 },
  md: { height: 52, paddingHorizontal: 20 },
  lg: { height: 60, paddingHorizontal: 24 },

  // Labels
  label: {
    fontWeight: FontWeight.semibold,
  },
  primaryLabel: { color: Colors.white, fontSize: FontSize.base },
  secondaryLabel: { color: Colors.textPrimary, fontSize: FontSize.base },
  ghostLabel: { color: Colors.primary, fontSize: FontSize.base },
  dangerLabel: { color: Colors.white, fontSize: FontSize.base },

  smLabel: { fontSize: FontSize.sm },
  mdLabel: { fontSize: FontSize.base },
  lgLabel: { fontSize: FontSize.md },

  disabled: {
    opacity: 0.45,
  },
});
