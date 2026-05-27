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
import { OnboardingStackParamList, Equipment } from '../../types';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { useUserProfileStore } from '../../store/userProfileStore';

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, 'Equipment'>;
  route: RouteProp<OnboardingStackParamList, 'Equipment'>;
};

const EQUIPMENT_OPTIONS: { value: Equipment; label: string; emoji: string }[] = [
  { value: 'BARBELL', label: 'Barbell', emoji: '🏋️' },
  { value: 'DUMBBELL', label: 'Dumbbells', emoji: '⚖️' },
  { value: 'CABLE', label: 'Cable Machine', emoji: '🔗' },
  { value: 'MACHINE', label: 'Gym Machines', emoji: '🤖' },
  { value: 'BODYWEIGHT', label: 'Bodyweight', emoji: '🧍' },
  { value: 'KETTLEBELL', label: 'Kettlebell', emoji: '🔔' },
  { value: 'RESISTANCE_BAND', label: 'Resistance Bands', emoji: '🟡' },
  { value: 'PULL_UP_BAR', label: 'Pull-Up Bar', emoji: '🔝' },
];

export const EquipmentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { onboardingDraft, toggleEquipment } = useUserProfileStore();
  const selected = onboardingDraft.availableEquipment;

  const isSelected = (eq: Equipment) => selected.includes(eq);

  const handleNext = () => {
    if (selected.length === 0) return;
    navigation.navigate('DaysPerWeek', {
      bodyType: route.params.bodyType,
      goal: route.params.goal,
      equipment: selected,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[Typography.label, styles.step]}>Step 3 of 4</Text>
          <Text style={[Typography.display, styles.title]}>Available{'\n'}equipment?</Text>
          <Text style={[Typography.bodyLarge, styles.subtitle]}>
            Only exercises matching your equipment will be programmed.
          </Text>
        </View>

        <View style={styles.grid}>
          {EQUIPMENT_OPTIONS.map((item) => {
            const active = isSelected(item.value);
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.equipCard, active && styles.equipCardActive]}
                onPress={() => toggleEquipment(item.value)}
                testID={`equip-${item.value.toLowerCase()}`}
              >
                <Text style={styles.equipEmoji}>{item.emoji}</Text>
                <Text
                  style={[
                    Typography.bodyMedium,
                    styles.equipLabel,
                    active && styles.equipLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
                {active && (
                  <View style={styles.activeDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[Typography.caption, styles.hint]}>
          {selected.length} item{selected.length !== 1 ? 's' : ''} selected
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={[Typography.bodyMedium, styles.backText]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, selected.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selected.length === 0}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  equipCard: {
    width: '46%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    position: 'relative',
  },
  equipCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryDim,
  },
  equipEmoji: {
    fontSize: 28,
    marginBottom: Spacing.sm,
  },
  equipLabel: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  equipLabelActive: {
    color: Colors.textPrimary,
  },
  activeDot: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  hint: {
    color: Colors.textMuted,
    textAlign: 'center',
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
