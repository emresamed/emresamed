import { useState } from 'react';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { colors } from '@/constants/theme';
import { cn } from '@/lib/utils';

import { Text } from './Text';

interface PasswordInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerClassName?: string;
}

export function PasswordInput({
  label,
  error,
  containerClassName,
  className,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View className={cn('gap-1.5', containerClassName)}>
      <Text variant="label">{label}</Text>
      <View className="relative">
        <TextInput
          placeholderTextColor="#71717A"
          secureTextEntry={!isVisible}
          autoCapitalize="none"
          autoCorrect={false}
          className={cn(
            'rounded-button border border-border bg-surface-elevated px-4 py-3 pr-12 text-base text-foreground',
            error && 'border-error',
            className,
          )}
          {...props}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isVisible ? 'Hide password' : 'Show password'}
          onPress={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-3 p-1"
        >
          {isVisible ? (
            <EyeOff color={colors.muted} size={20} />
          ) : (
            <Eye color={colors.muted} size={20} />
          )}
        </Pressable>
      </View>
      {error ? (
        <Text variant="caption" className="text-error">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
