import React, { useEffect, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { WorkoutDayPlan } from "../../domain/types";
import { useRestTimer } from "../hooks/useRestTimer";
import { useActiveWorkoutSession } from "../models/useActiveWorkoutSession";
import { darkTheme } from "../theme/darkTheme";
import { ExerciseCard } from "../components/ExerciseCard";
import { RestTimerCard } from "../components/RestTimerCard";

interface ActiveWorkoutScreenProps {
  dayPlan: WorkoutDayPlan;
  exerciseNameById: Record<string, string>;
}

export function ActiveWorkoutScreen({
  dayPlan,
  exerciseNameById
}: ActiveWorkoutScreenProps) {
  const session = useActiveWorkoutSession(dayPlan);
  const timer = useRestTimer(90);
  const { remainingSec, progress, isRunning, start, pause, reset } = timer;

  const checkedSetKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const completed of session.completedSets) {
      keys.add(`${completed.exerciseId}-${completed.setIndex}`);
    }
    return keys;
  }, [session.completedSets]);

  if (!session.currentExercise) {
    return (
      <View style={styles.screen}>
        <Text style={styles.heading}>No exercises scheduled</Text>
      </View>
    );
  }

  const currentExercise = session.currentExercise;
  const currentExerciseName = exerciseNameById[currentExercise.exerciseId] ?? currentExercise.exerciseId;
  const suggestedRestSec = currentExercise.sets[0]?.restSec ?? 90;

  useEffect(() => {
    reset(suggestedRestSec);
  }, [suggestedRestSec, reset]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.caption}>Active Workout</Text>
        <Text style={styles.heading}>{dayPlan.focus.toUpperCase()}</Text>
        <Text style={styles.subheading}>
          Exercise {session.currentExerciseIndex + 1}/{session.totalExercises} • Completed{" "}
          {Math.round(session.completionRate * 100)}%
        </Text>
      </View>

      <ExerciseCard
        exercise={currentExercise}
        title={currentExerciseName}
        checkedSetKeys={checkedSetKeys}
        onToggleSet={(setIndex) => {
          session.toggleSet(currentExercise.exerciseId, setIndex);
          start(suggestedRestSec);
        }}
      />

      <RestTimerCard
        remainingSec={remainingSec}
        progress={progress}
        isRunning={isRunning}
        onStart={() => start(suggestedRestSec)}
        onPause={pause}
        onReset={() => reset(suggestedRestSec)}
      />

      <View style={styles.navigationRow}>
        <Pressable
          onPress={session.previousExercise}
          style={styles.navButton}
          accessibilityRole="button"
          accessibilityLabel="Previous exercise"
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </Pressable>

        <Pressable
          onPress={session.nextExercise}
          style={[styles.navButton, styles.navButtonPrimary]}
          accessibilityRole="button"
          accessibilityLabel="Next exercise"
        >
          <Text style={[styles.navButtonText, styles.navButtonPrimaryText]}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: darkTheme.colors.background,
    flex: 1
  },
  content: {
    gap: darkTheme.spacing.md,
    padding: darkTheme.spacing.md
  },
  headerCard: {
    backgroundColor: darkTheme.colors.card,
    borderColor: darkTheme.colors.border,
    borderRadius: darkTheme.radius.lg,
    borderWidth: 1,
    gap: darkTheme.spacing.xs,
    padding: darkTheme.spacing.md
  },
  caption: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.typography.caption,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  heading: {
    color: darkTheme.colors.textPrimary,
    fontSize: darkTheme.typography.title,
    fontWeight: "700"
  },
  subheading: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.typography.body
  },
  navigationRow: {
    flexDirection: "row",
    gap: darkTheme.spacing.sm
  },
  navButton: {
    alignItems: "center",
    backgroundColor: darkTheme.colors.surface,
    borderColor: darkTheme.colors.border,
    borderRadius: darkTheme.radius.md,
    borderWidth: 1,
    flex: 1,
    paddingVertical: darkTheme.spacing.sm
  },
  navButtonPrimary: {
    backgroundColor: darkTheme.colors.accent,
    borderColor: darkTheme.colors.accent
  },
  navButtonText: {
    color: darkTheme.colors.textSecondary,
    fontSize: darkTheme.typography.body,
    fontWeight: "700"
  },
  navButtonPrimaryText: {
    color: darkTheme.colors.textPrimary
  }
});
