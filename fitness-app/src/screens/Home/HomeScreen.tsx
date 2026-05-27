import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, WorkoutDay, MuscleGroup } from '../../types';
import { useUserProfileStore } from '../../store/userProfileStore';
import { MuscleGroupCard } from '../../components/MuscleGroupCard';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParamList, 'Home'>;
};

const GOAL_LABELS: Record<string, string> = {
  STRENGTH: 'Strength',
  HYPERTROPHY: 'Hypertrophy',
  FAT_LOSS: 'Fat Loss',
};

const BODY_TYPE_LABELS: Record<string, string> = {
  ECTOMORPH: 'Ectomorph',
  MESOMORPH: 'Mesomorph',
  ENDOMORPH: 'Endomorph',
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, program } = useUserProfileStore();

  if (!profile || !program) return null;

  const activeDays = program.days.filter((d) => !d.isRestDay);
  const greeting = getGreeting();

  // Aggregate weekly sets per muscle group across the full program
  const muscleSetTotals = computeMuscleSetTotals(activeDays);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting header */}
        <View style={styles.greeting}>
          <Text style={[Typography.label, styles.greetLabel]}>{greeting}</Text>
          <Text style={[Typography.display, styles.greetTitle]}>
            Week {program.currentWeek} of {program.weeks}
          </Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={[Typography.captionBold, styles.tagText]}>
                {BODY_TYPE_LABELS[profile.bodyType]}
              </Text>
            </View>
            <View style={[styles.tag, styles.tagPrimary]}>
              <Text style={[Typography.captionBold, styles.tagTextPrimary]}>
                {GOAL_LABELS[profile.primaryGoal]}
              </Text>
            </View>
            <View style={styles.tag}>
              <Text style={[Typography.captionBold, styles.tagText]}>
                {program.splitType.replace('_', '/')}
              </Text>
            </View>
          </View>
        </View>

        {/* Weekly muscle volume */}
        <View style={styles.section}>
          <Text style={[Typography.h2, styles.sectionTitle]}>Weekly Volume</Text>
          <Text style={[Typography.body, styles.sectionSub]}>
            Total sets per muscle group this week
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.muscleRow}
          >
            {(Object.entries(muscleSetTotals) as [MuscleGroup, number][]).map(
              ([muscle, count]) => (
                <MuscleGroupCard
                  key={muscle}
                  muscle={muscle}
                  setCount={count}
                  style={{ marginRight: Spacing.md }}
                />
              ),
            )}
          </ScrollView>
        </View>

        {/* Workout days */}
        <View style={styles.section}>
          <Text style={[Typography.h2, styles.sectionTitle]}>This Week</Text>
          {program.days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              onPress={() => {
                if (!day.isRestDay) {
                  navigation.navigate('ActiveWorkout', { workoutDayId: day.id });
                }
              }}
            />
          ))}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Day card sub-component ───────────────────────────────────────────────────

const DayCard: React.FC<{ day: WorkoutDay; onPress: () => void }> = ({
  day,
  onPress,
}) => {
  if (day.isRestDay) {
    return (
      <View style={[styles.dayCard, styles.dayCardRest]}>
        <Text style={[Typography.label, styles.dayIndex]}>Day {day.dayIndex}</Text>
        <Text style={[Typography.h3, styles.dayLabelRest]}>Rest Day</Text>
        <Text style={[Typography.body, styles.dayRestSub]}>
          Recovery & sleep
        </Text>
      </View>
    );
  }

  const exerciseCount = day.exerciseSlots.length;
  const totalSets = day.exerciseSlots.reduce((s, e) => s + e.sets, 0);

  return (
    <TouchableOpacity style={styles.dayCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.dayCardLeft}>
        <Text style={[Typography.label, styles.dayIndex]}>Day {day.dayIndex}</Text>
        <Text style={[Typography.h3, styles.dayLabelActive]}>{day.label}</Text>
        <View style={styles.dayMeta}>
          <Text style={[Typography.caption, styles.dayMetaText]}>
            {exerciseCount} exercises
          </Text>
          <Text style={[Typography.caption, styles.dayMetaDot]}>·</Text>
          <Text style={[Typography.caption, styles.dayMetaText]}>
            {totalSets} sets
          </Text>
        </View>
      </View>
      <View style={styles.startBtn}>
        <Text style={styles.startArrow}>▶</Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function computeMuscleSetTotals(
  days: WorkoutDay[],
): Partial<Record<MuscleGroup, number>> {
  const totals: Partial<Record<MuscleGroup, number>> = {};
  for (const day of days) {
    for (const group of day.muscleGroupFocus) {
      const groupSets = day.exerciseSlots
        .filter(() => day.muscleGroupFocus.includes(group))
        .reduce((sum, slot) => sum + slot.sets, 0);
      totals[group] = (totals[group] ?? 0) + groupSets;
    }
  }
  return totals;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingBottom: Spacing.xxxl,
  },
  greeting: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greetLabel: {
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  greetTitle: {
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagPrimary: {
    backgroundColor: Colors.primaryDim,
    borderColor: Colors.primary,
  },
  tagText: {
    color: Colors.textSecondary,
  },
  tagTextPrimary: {
    color: Colors.primary,
  },
  section: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionSub: {
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
  },
  muscleRow: {
    paddingVertical: Spacing.xs,
    paddingRight: Spacing.base,
  },
  dayCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayCardRest: {
    opacity: 0.5,
  },
  dayCardLeft: {
    flex: 1,
  },
  dayIndex: {
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  dayLabelActive: {
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  dayLabelRest: {
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  dayRestSub: {
    color: Colors.textMuted,
  },
  dayMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dayMetaText: {
    color: Colors.textSecondary,
  },
  dayMetaDot: {
    color: Colors.textMuted,
  },
  startBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startArrow: {
    color: Colors.textInverse,
    fontSize: 14,
    marginLeft: 2,
  },
  bottomPad: {
    height: Spacing.xxxl,
  },
});
