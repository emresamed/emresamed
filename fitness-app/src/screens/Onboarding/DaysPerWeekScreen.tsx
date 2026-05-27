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
import { OnboardingStackParamList } from '../../types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { useUserProfileStore } from '../../store/userProfileStore';
import { resolveSplitType } from '../../data/splitTemplates';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'DaysPerWeek'>;
  route: RouteProp<OnboardingStackParamList, 'DaysPerWeek'>;
};

const SPLIT_LABELS: Record<string, string> = {
  FULL_BODY: 'Full Body split',
  UPPER_LOWER: 'Upper / Lower split',
  PUSH_PULL_LEGS: 'Push / Pull / Legs split',
};

export const DaysPerWeekScreen: React.FC<Props> = ({ navigation }) => {
  const { onboardingDraft, setTrainingDays, completeOnboarding } =
    useUserProfileStore();

  const days = onboardingDraft.trainingDaysPerWeek;
  const splitType = resolveSplitType(days);

  const handleFinish = () => {
    try {
      completeOnboarding();
      // AppNavigator handles routing once isOnboarded flips to true
    } catch (error) {
      // completeOnboarding throws if bodyType/goal are null (defensive only)
      console.error('Onboarding error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[Typography.label, styles.step]}>Step 4 of 4</Text>
          <Text style={[Typography.display, styles.title]}>
            Days per{'\n'}week?
          </Text>
          <Text style={[Typography.bodyLarge, styles.subtitle]}>
            This determines your weekly workout split structure.
          </Text>
        </View>

        {/* Day selector */}
        <View style={styles.dayRow}>
          {[2, 3, 4, 5, 6].map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.dayButton, days === d && styles.dayButtonActive]}
              onPress={() => setTrainingDays(d)}
              testID={`days-${d}`}
            >
              <Text
                style={[
                  Typography.h1,
                  styles.dayNumber,
                  days === d && styles.dayNumberActive,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Split preview */}
        <View style={styles.splitPreview}>
          <Text style={[Typography.label, styles.splitLabel]}>
            Recommended split
          </Text>
          <Text style={[Typography.h2, styles.splitName]}>
            {SPLIT_LABELS[splitType]}
          </Text>
          <Text style={[Typography.body, styles.splitDesc]}>
            {splitDescription(splitType)}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[Typography.bodyMedium, styles.backText]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
          <Text style={[Typography.h3, styles.finishText]}>
            Build My Program 🚀
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

function splitDescription(splitType: string): string {
  switch (splitType) {
    case 'FULL_BODY':
      return 'Train all major muscle groups each session. Ideal for maximising frequency with minimum days.';
    case 'UPPER_LOWER':
      return 'Alternate between upper and lower body days. Great balance of frequency and volume.';
    case 'PUSH_PULL_LEGS':
      return 'Push (chest/shoulders/triceps), Pull (back/biceps), and Legs on separate days. Maximum volume per muscle.';
    default:
      return '';
  }
}

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
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  dayButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  dayButtonActive: {
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primary,
  },
  dayNumber: {
    color: Colors.textSecondary,
  },
  dayNumberActive: {
    color: Colors.primary,
  },
  splitPreview: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  splitLabel: {
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  splitName: {
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  splitDesc: {
    color: Colors.textSecondary,
    lineHeight: 22,
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
  finishButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  finishText: {
    color: Colors.textInverse,
  },
});
