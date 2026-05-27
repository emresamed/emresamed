import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  type ViewProps,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { cn } from '@/utils/cn';

export type ScreenProps = ViewProps & {
  edges?: Edge[];
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  contentClassName?: string;
};

/**
 * Standard screen wrapper.
 *  - Applies safe-area insets (top + bottom by default).
 *  - Optional scrolling and keyboard-avoidance for forms.
 *  - Uses bg-bg so every screen inherits the dark canvas.
 */
export function Screen({
  edges = ['top', 'bottom'],
  scroll = false,
  keyboardAvoiding = false,
  className,
  contentClassName,
  children,
  ...rest
}: ScreenProps) {
  const inner = scroll ? (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className={cn('flex-1', contentClassName)}>{children}</View>
    </ScrollView>
  ) : (
    <View className={cn('flex-1', contentClassName)}>{children}</View>
  );

  const body = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-bg', className)} {...rest}>
      {body}
    </SafeAreaView>
  );
}
