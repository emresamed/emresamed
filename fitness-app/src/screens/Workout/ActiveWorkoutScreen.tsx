import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { AppStackParamList } from '../../types';
import { useWorkoutSessionStore } from '../../store/workoutSessionStore';
import { useUserProfileStore } from '../../store/userProfileStore';
import { getExerciseById } from '../../data/exercises';
import { SetRow } from '../../components/SetRow';
import { RestTimer } from '../../components/RestTimer';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing, BorderRadius } from '../../theme/spacing';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParamList, 'ActiveWorkout'>;
  route: RouteProp<AppStackParamList, 'ActiveWorkout'>;
};

export const ActiveWorkoutScreen: React.FC<Props> = ({ navigation, route }) => {
  const { workoutDayId } = route.params;

  const { program } = useUserProfileStore();
  const {
    session,
    activeDay,
    startSession,
    completeSession,
    abandonSession,
    toggleSetCompletion,
    startRestTimer,
    tickRestTimer,
    resetRestTimer,
    completedSetsForDay,
    totalSetsForDay,
    getSlotLogs,
  } = useWorkoutSessionStore();

  const profile = useUserProfileStore((s) => s.profile);

  // Start session on mount if not already started
  React.useEffect(() => {
    if (!session && program && profile) {
      const day = program.days.find((d) => d.id === workoutDayId);
      if (day) {
        startSession(profile.id, day);
      }
    }
  }, [session, program, profile, workoutDayId, startSession]);

  const handleCompleteWorkout = useCallback(() => {
    const total = totalSetsForDay();
    const completed = completedSetsForDay();
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (pct < 100) {
      Alert.alert(
        'Finish Early?',
        `You've completed ${completed}/${total} sets (${pct}%). Are you sure you want to finish?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Finish',
            style: 'destructive',
            onPress: () => {
              completeSession();
              navigation.replace('WorkoutSummary', {
                sessionId: session?.id ?? '',
              });
            },
          },
        ],
      );
    } else {
      completeSession();
      navigation.replace('WorkoutSummary', { sessionId: session?.id ?? '' });
    }
  }, [
    completedSetsForDay,
    totalSetsForDay,
    completeSession,
    navigation,
    session,
  ]);

  const handleAbandon = useCallback(() => {
    Alert.alert(
      'Abandon Workout?',
      'Your progress will be saved but the session will be marked as abandoned.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Abandon',
          style: 'destructive',
          onPress: () => {
            abandonSession();
            navigation.goBack();
          },
        },
      ],
    );
  }, [abandonSession, navigation]);

  const progressPct = useMemo(() => {
    const total = totalSetsForDay();
    const completed = completedSetsForDay();
    return total > 0 ? completed / total : 0;
  }, [totalSetsForDay, completedSetsForDay]);

  const progressWidth = useSharedValue(0);
  React.useEffect(() => {
    progressWidth.value = withTiming(progressPct, { duration: 400 });
  }, [progressPct, progressWidth]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  if (!session || !activeDay) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <Text style={[Typography.bodyLarge, styles.loadingText]}>
            Preparing workout...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const timerState = session.restTimerState;
  const slots = activeDay.exerciseSlots;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleAbandon} style={styles.abandonBtn}>
          <Text style={[Typography.bodyMedium, styles.abandonText]}>✕</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={[Typography.h3, styles.dayLabel]}>{activeDay.label}</Text>
          <Text style={[Typography.caption, styles.setCount]}>
            {completedSetsForDay()}/{totalSetsForDay()} sets
          </Text>
        </View>

        <TouchableOpacity onPress={handleCompleteWorkout} style={styles.finishBtn}>
          <Text style={[Typography.bodyMedium, styles.finishText]}>Finish</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>

      {/* Rest timer (sticky above list) */}
      <RestTimer
        timerState={timerState}
        onTick={tickRestTimer}
        onSkip={resetRestTimer}
        onComplete={resetRestTimer}
      />

      {/* Exercise slots */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {slots.map((slot) => {
          const exercise = getExerciseById(slot.exerciseId);
          if (!exercise) return null;

          const slotLogs = getSlotLogs(slot.slotOrder);
          const completedCount = slotLogs.filter((l) => l.isCompleted).length;
          const isSlotDone = completedCount === slot.sets;

          return (
            <View
              key={slot.slotOrder}
              style={[styles.exerciseCard, isSlotDone && styles.exerciseCardDone]}
              testID={`exercise-slot-${slot.slotOrder}`}
            >
              {/* Exercise header */}
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseTitleBlock}>
                  <Text style={[Typography.h3, styles.exerciseName]}>
                    {exercise.name}
                  </Text>
                  <View style={styles.badgeRow}>
                    <View style={[styles.badge, styles.mechanicsBadge]}>
                      <Text style={[Typography.captionBold, styles.badgeText]}>
                        {exercise.mechanics}
                      </Text>
                    </View>
                    <View style={styles.badge}>
                      <Text style={[Typography.captionBold, styles.badgeText]}>
                        {exercise.primaryMuscle}
                      </Text>
                    </View>
                    <View style={styles.badge}>
                      <Text style={[Typography.captionBold, styles.badgeText]}>
                        RPE {slot.rpeTarget}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.restBadge}>
                  <Text style={[Typography.captionBold, styles.restText]}>
                    {slot.restSeconds}s rest
                  </Text>
                </View>
              </View>

              {/* Column headers */}
              <View style={styles.colHeaders}>
                <Text style={[Typography.label, styles.colHeader, { width: 28 }]}>
                  Set
                </Text>
                <Text style={[Typography.label, styles.colHeader, { flex: 1 }]}>
                  Target
                </Text>
                <Text style={[Typography.label, styles.colHeader, { width: 48 }]}>
                  Reps
                </Text>
                <Text style={[Typography.label, styles.colHeader, { width: 64, textAlign: 'right' }]}>
                  Load
                </Text>
                <Text style={[Typography.label, styles.colHeader, { width: 26 }]}>
                  {' '}
                </Text>
              </View>

              {/* Set rows */}
              {Array.from({ length: slot.sets }, (_, i) => {
                const setNum = i + 1;
                const log = slotLogs.find((l) => l.setNumber === setNum);
                return (
                  <SetRow
                    key={setNum}
                    setNumber={setNum}
                    targetReps={slot.repRangeHigh}
                    repRangeLow={slot.repRangeLow}
                    repRangeHigh={slot.repRangeHigh}
                    log={log}
                    onToggle={() =>
                      toggleSetCompletion(slot.slotOrder, setNum)
                    }
                    onRestStart={() =>
                      startRestTimer(slot.restSeconds, slot.slotOrder, setNum)
                    }
                    testID={`set-row-${slot.slotOrder}-${setNum}`}
                  />
                );
              })}

              {/* Completion indicator */}
              {isSlotDone && (
                <View style={styles.doneBanner}>
                  <Text style={[Typography.captionBold, styles.doneText]}>
                    ✓ Exercise complete
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabel: {
    color: Colors.textPrimary,
  },
  setCount: {
    color: Colors.textSecondary,
    marginTop: 2,
  },
  abandonBtn: {
    padding: Spacing.sm,
  },
  abandonText: {
    color: Colors.textSecondary,
    fontSize: 18,
  },
  finishBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  finishText: {
    color: Colors.textInverse,
  },
  progressTrack: {
    height: 2,
    backgroundColor: Colors.border,
  },
  progressFill: {
    height: 2,
    backgroundColor: Colors.primary,
  },
  scroll: {
    padding: Spacing.base,
  },
  exerciseCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.base,
    marginBottom: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exerciseCardDone: {
    borderColor: Colors.success,
    backgroundColor: Colors.successDim,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  exerciseTitleBlock: {
    flex: 1,
  },
  exerciseName: {
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: Colors.cardElevated,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  mechanicsBadge: {
    backgroundColor: `${Colors.primary}20`,
  },
  badgeText: {
    color: Colors.textSecondary,
  },
  restBadge: {
    backgroundColor: Colors.cardElevated,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  restText: {
    color: Colors.timerActive,
  },
  colHeaders: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xs,
    alignItems: 'center',
    gap: 0,
  },
  colHeader: {
    color: Colors.textMuted,
    marginRight: Spacing.md,
  },
  doneBanner: {
    backgroundColor: Colors.successDim,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  doneText: {
    color: Colors.success,
  },
  bottomPad: {
    height: Spacing.xxxl,
  },
});
