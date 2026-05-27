import React, { useState, forwardRef } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Colors, FontSize, FontWeight, BorderRadius, Spacing } from '@/constants';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<RNTextInput, InputProps>(
  ({ label, error, hint, secureTextEntry, style, ...rest }, ref) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry ?? false);
    const [isFocused, setIsFocused] = useState(false);

    const hasError = Boolean(error);
    const isPassword = secureTextEntry;

    return (
      <View style={styles.wrapper}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View
          style={[
            styles.inputContainer,
            isFocused && styles.focused,
            hasError && styles.errored,
          ]}
        >
          <RNTextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={Colors.textMuted}
            selectionColor={Colors.primary}
            secureTextEntry={isPassword ? isSecure : false}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoCorrect={false}
            autoCapitalize="none"
            {...rest}
          />

          {isPassword && (
            <TouchableOpacity
              onPress={() => setIsSecure((v) => !v)}
              style={styles.eyeButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {isSecure ? (
                <Eye size={18} color={Colors.textMuted} />
              ) : (
                <EyeOff size={18} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          )}
        </View>

        {hasError && <Text style={styles.error}>{error}</Text>}
        {!hasError && hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.surfaceBorder,
    paddingHorizontal: Spacing.base,
    height: 52,
  },
  focused: {
    borderColor: Colors.primary,
  },
  errored: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    height: '100%',
  },
  eyeButton: {
    paddingLeft: Spacing.sm,
  },
  error: {
    fontSize: FontSize.xs,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  },
  hint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
