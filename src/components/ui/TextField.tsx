import { Eye, EyeOff } from 'lucide-react-native';
import { forwardRef, useState } from 'react';
import {
  Pressable,
  TextInput,
  View,
  type TextInputProps,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
} from 'react-native';

import { colors } from '@/theme';
import { cn } from '@/utils/cn';

import { Text } from './Text';

export type TextFieldProps = Omit<TextInputProps, 'onBlur' | 'onFocus'> & {
  label?: string;
  error?: string;
  helperText?: string;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  containerClassName?: string;
};

/**
 * Form input with label, helper, and validation error state.
 * For password fields (secureTextEntry), renders an internal show/hide toggle.
 */
export const TextField = forwardRef<TextInput, TextFieldProps>(
  (
    {
      label,
      error,
      helperText,
      secureTextEntry,
      onFocus,
      onBlur,
      containerClassName,
      ...rest
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(!secureTextEntry);
    const isSecure = !!secureTextEntry;

    return (
      <View className={cn('w-full', containerClassName)}>
        {label ? (
          <Text variant="caption" tone="muted" className="mb-1.5">
            {label}
          </Text>
        ) : null}

        <View
          className={cn(
            'h-12 flex-row items-center rounded-lg border bg-surface px-4',
            focused ? 'border-brand' : 'border-border',
            error && 'border-accent',
          )}
        >
          <TextInput
            ref={ref}
            className="flex-1 text-text"
            placeholderTextColor={colors.text.subtle}
            secureTextEntry={isSecure && !visible}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={{ fontSize: 15, paddingVertical: 0 }}
            {...rest}
          />

          {isSecure ? (
            <Pressable
              hitSlop={12}
              onPress={() => setVisible((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            >
              {visible ? (
                <EyeOff size={18} color={colors.text.muted} />
              ) : (
                <Eye size={18} color={colors.text.muted} />
              )}
            </Pressable>
          ) : null}
        </View>

        {error ? (
          <Text variant="caption" tone="danger" className="mt-1.5">
            {error}
          </Text>
        ) : helperText ? (
          <Text variant="caption" tone="subtle" className="mt-1.5">
            {helperText}
          </Text>
        ) : null}
      </View>
    );
  },
);

TextField.displayName = 'TextField';
