import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../types';
import { useWorkoutSessionStore } from '../../store/workoutSessionStore';
import { getExerciseById } from '../../data/exercises';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParamList, 'WorkoutSummary'>;
  route: RouteProp<AppStackParamList, 'WorkoutSummary'>;
};

export const WorkoutSummaryScreen: React.FC<Props> = ({ navigation }) => {
  const { session, activeDay } = useWorkoutSessionStore();

  if (!session || !activeDay) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={[Typography.h2, styles.emptyText]}>No session data</Text>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[Typography.bodyMedium, styles.homeBtnText]}>
              Go Home
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const completedLogs = session.setLogs.filter((l) => l.isCompleted);
  const totalSets = session.setLogs.length;
  const completionPct =
    totalSets > 0 ? Math.round((completedLogs.length / totalSets) * 100) : 0;

  const durationMs = session.completedAt
    ? new Date(session.completedAt).getTime() -
      new Date(session.startedAt).getTime()
    : 0;
  const durationMin = Math.round(durationMs / 60000);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.trophy}>
            {completionPct === 100 ? '🏆' : '💪'}
          </Text>
          <Text style={[Typography.display, styles.heroTitle]}>
            {completionPct === 100 ? 'Crushed it!' : 'Good work!'}
          </Text>
          <Text style={[Typography.bodyLarge, styles.heroSub]}>
            {activeDay.label} complete
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard label="Completion" value={`${completionPct}%`} />
          <StatCard label="Sets Done" value={`${completedLogs.length}`} />
          <StatCard label="Duration" value={`${durationMin}m`} />
        </View>

        {/* Per-exercise summary */}
        <View style={styles.section}>
          <Text style={[Typography.h2, styles.sectionTitle]}>
            Exercise Summary
          </Text>
          {activeDay.exerciseSlots.map((slot) => {
            const exercise = getExerciseById(slot.exerciseId);
            const slotLogs = session.setLogs.filter(
              (l) => l.slotOrder === slot.slotOrder && l.isCompleted,
            );
            if (!exercise) return null;
            return (
              <View key={slot.slotOrder} style={styles.exerciseRow}>
                <Text style={[Typography.bodyMedium, styles.exName]}>
                  {exercise.name}
                </Text>
                <Text style={[Typography.body, styles.exMeta]}>
                  {slotLogs.length}/{slot.sets} sets ·{' '}
                  {slot.repRangeLow}–{slot.repRangeHigh} reps
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[Typography.h3, styles.homeBtnText]}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const StatCard: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.statCard}>
    <Text style={[Typography.numberSmall, styles.statValue]}>{value}</Text>
    <Text style={[Typography.caption, styles.statLabel]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
  },
  scroll: {
    paddingBottom: Spacing.xxxl,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.base,
  },
  trophy: {
    fontSize: 64,
    marginBottom: Spacing.base,
  },
  heroTitle: {
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  heroSub: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: Spacing.base,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    marginBottom: Spacing.base,
  },
  exerciseRow: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exName: {
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  exMeta: {
    color: Colors.textSecondary,
  },
  footer: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  homeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  homeBtnText: {
    color: Colors.textInverse,
  },
});
