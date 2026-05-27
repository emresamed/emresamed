import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { loadSeedData } from "../../data/seedLoader";
import { MuscleGroup, UserMetrics, WorkoutProgram } from "../../domain/types";
import { safeGenerateWorkoutProgram } from "../../engine/workoutGenerator";
import { OnboardingStore } from "../../state/onboardingStore";
import { AppErrorBoundary } from "../components/AppErrorBoundary";
import { darkTheme } from "../theme/darkTheme";
import { ActiveWorkoutScreen } from "./ActiveWorkoutScreen";
import { OnboardingScreen } from "./OnboardingScreen";

interface AppState {
  profile: UserMetrics;
  preferredMuscles: MuscleGroup[];
  program: WorkoutProgram;
}

export function MobileFitnessApp() {
  const onboardingStore = useMemo(() => new OnboardingStore(), []);
  const loadedSeedData = useMemo(() => loadSeedData(), []);
  const [appState, setAppState] = useState<AppState | null>(null);
  const [appError, setAppError] = useState<string | null>(null);

  const exerciseNameById = useMemo(
    () =>
      Object.fromEntries(loadedSeedData.exerciseSeed.map((exercise) => [exercise.id, exercise.name])),
    [loadedSeedData.exerciseSeed]
  );

  const handleCompleted = (profile: UserMetrics, preferredMuscles: MuscleGroup[]): void => {
    setAppError(null);
    const result = safeGenerateWorkoutProgram(profile, loadedSeedData);
    if (!result.ok) {
      setAppError(result.error.message);
      return;
    }
    setAppState({ profile, preferredMuscles, program: result.program });
  };

  const content = !appState ? (
    <OnboardingScreen
      store={onboardingStore}
      onCompleted={handleCompleted}
    />
  ) : (() => {
    const firstDayPlan = appState.program.weeklyPlan[0];
    if (!firstDayPlan) {
      return (
      <OnboardingScreen
        store={onboardingStore}
        onCompleted={handleCompleted}
      />
      );
    }
    return <ActiveWorkoutScreen dayPlan={firstDayPlan} exerciseNameById={exerciseNameById} />;
  })();

  return (
    <AppErrorBoundary>
      <View style={styles.container}>
        {content}
        {appError ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{appError}</Text>
          </View>
        ) : null}
      </View>
    </AppErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.colors.background,
    flex: 1
  },
  errorBanner: {
    backgroundColor: "#2A1515",
    borderColor: darkTheme.colors.danger,
    borderWidth: 1,
    margin: darkTheme.spacing.md,
    padding: darkTheme.spacing.sm
  },
  errorText: {
    color: darkTheme.colors.danger,
    fontSize: darkTheme.typography.body
  }
});
