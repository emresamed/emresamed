import { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';

import { APP_CONFIG } from '@/constants/config';
import { cn } from '@/lib/utils';

import { Screen, Text } from '../ui';

interface AuthScreenLayoutProps extends PropsWithChildren {
  title: string;
  subtitle: string;
  className?: string;
}

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  className,
}: AuthScreenLayoutProps) {
  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow px-6 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className={cn('flex-1 justify-center py-8', className)}>
            <Text variant="caption" className="uppercase tracking-widest text-primary">
              {APP_CONFIG.name}
            </Text>
            <Text variant="title" className="mt-2">
              {title}
            </Text>
            <Text variant="body" className="mt-2 mb-8">
              {subtitle}
            </Text>
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
