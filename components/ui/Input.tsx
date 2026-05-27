import { TextInput, TextInputProps, View } from 'react-native';

import { cn } from '@/lib/utils';

import { Text } from './Text';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <View className={cn('gap-1.5', containerClassName)}>
      <Text variant="label">{label}</Text>
      <TextInput
        placeholderTextColor="#71717A"
        className={cn(
          'rounded-button border border-border bg-surface-elevated px-4 py-3 text-base text-foreground',
          error && 'border-error',
          className,
        )}
        {...props}
      />
      {error ? (
        <Text variant="caption" className="text-error">
          {error}
        </Text>
      ) : null}
    </View>
  );
}
