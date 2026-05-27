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
import { RouteProp } from '@react-navigation/native';
import { OnboardingStackParamList, Goal } from '../../types';
import { OnboardingOptionCard } from '../../components/OnboardingOptionCard';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { useUserProfileStore } from '../../store/userProfileStore';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Goal'>;
  route: RouteProp<OnboardingStackParamList, 'Goal'>;
};

const GOALS: { value: Goal; title: string; subtitle: string; emoji: string }[] = [
  {
    value: 'STRENGTH',
    title: 'Build Strength',
    subtitle: '1–5 reps · 85–100% 1RM · Long rest · Linear progression',
    emoji: '🏆',
  },
  {
    value: 'HYPERTROPHY',
    title: 'Muscle Hypertrophy',
    subtitle: '6–12 reps · 65–85% 1RM · Moderate rest · Double progressive',
    emoji: '💪',
  },
  {
    value: 'FAT_LOSS',
    title: 'Fat Loss',
    subtitle: '12–20 reps · 50–65% 1RM · Short rest · Volume progressive',
    emoji: '🔥',
  },
];

export const GoalScreen: React.FC<Props> = ({ navigation, route }) => {
  const { onboardingDraft, setGoal } = useUserProfileStore();
  const selected = onboardingDraft.goal;

  const handleNext = () => {
    if (!selected) return;
    navigation.navigate('Equipment', {
      bodyType: route.params.bodyType,
      goal: selected,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[Typography.label, styles.step]}>Step 2 of 4</Text>
          <Text style={[Typography.display, styles.title]}>What's your{'\n'}primary goal?</Text>
          <Text style={[Typography.bodyLarge, styles.subtitle]}>
            Your goal dictates rep ranges, rest periods, and progression strategy.
          </Text>
        </View>

        <View style={styles.options}>
          {GOALS.map((item) => (
            <OnboardingOptionCard
              key={item.value}
              title={item.title}
              subtitle={item.subtitle}
              emoji={item.emoji}
              isSelected={selected === item.value}
              onPress={() => setGoal(item.value)}
              testID={`goal-${item.value.toLowerCase()}`}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[Typography.bodyMedium, styles.backText]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!selected}
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
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.bg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  backButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  backText: {
    color: Colors.textSecondary,
  },
  nextButton: {
    flex: 2,
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
