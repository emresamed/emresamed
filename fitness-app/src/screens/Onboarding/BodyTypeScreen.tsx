import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList, BodyType } from '../../types';
import { OnboardingOptionCard } from '../../components/OnboardingOptionCard';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { useUserProfileStore } from '../../store/userProfileStore';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'BodyType'>;
};

const BODY_TYPES: {
  value: BodyType;
  title: string;
  subtitle: string;
  emoji: string;
}[] = [
  {
    value: 'ECTOMORPH',
    title: 'Ectomorph',
    subtitle: 'Lean build, fast metabolism, hard to gain muscle',
    emoji: '🦴',
  },
  {
    value: 'MESOMORPH',
    title: 'Mesomorph',
    subtitle: 'Athletic build, gains muscle easily, responds to any stimulus',
    emoji: '⚡',
  },
  {
    value: 'ENDOMORPH',
    title: 'Endomorph',
    subtitle: 'Stocky build, slow metabolism, gains fat easily',
    emoji: '🔥',
  },
];

export const BodyTypeScreen: React.FC<Props> = ({ navigation }) => {
  const { onboardingDraft, setBodyType } = useUserProfileStore();
  const selected = onboardingDraft.bodyType;

  const handleNext = () => {
    if (!selected) return;
    navigation.navigate('Goal', { bodyType: selected });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[Typography.label, styles.step]}>Step 1 of 4</Text>
          <Text style={[Typography.display, styles.title]}>What's your{'\n'}body type?</Text>
          <Text style={[Typography.bodyLarge, styles.subtitle]}>
            This determines your optimal training volume and recovery needs.
          </Text>
        </View>

        <View style={styles.options}>
          {BODY_TYPES.map((item) => (
            <OnboardingOptionCard
              key={item.value}
              title={item.title}
              subtitle={item.subtitle}
              emoji={item.emoji}
              isSelected={selected === item.value}
              onPress={() => setBodyType(item.value)}
              testID={`body-type-${item.value.toLowerCase()}`}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selected}
          testID="next-button"
        >
          <Text style={[Typography.h3, styles.nextButtonText]}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  header: {
    paddingTop: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  step: {
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    color: Colors.textSecondary,
  },
  options: {
    gap: Spacing.xs,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonText: {
    color: Colors.textInverse,
  },
});
