import React, { useMemo, useState } from "react";
import { seedData } from "../../data/seedData";
import { MuscleGroup, UserMetrics, WorkoutProgram } from "../../domain/types";
import { generateWorkoutProgram } from "../../engine/workoutGenerator";
import { OnboardingStore } from "../../state/onboardingStore";
import { ActiveWorkoutScreen } from "./ActiveWorkoutScreen";
import { OnboardingScreen } from "./OnboardingScreen";

interface AppState {
  profile: UserMetrics;
  preferredMuscles: MuscleGroup[];
  program: WorkoutProgram;
}

export function MobileFitnessApp() {
  const onboardingStore = useMemo(() => new OnboardingStore(), []);
  const [appState, setAppState] = useState<AppState | null>(null);

  const exerciseNameById = useMemo(
    () =>
      Object.fromEntries(seedData.exerciseSeed.map((exercise) => [exercise.id, exercise.name])),
    []
  );

  if (!appState) {
    return (
      <OnboardingScreen
        store={onboardingStore}
        onCompleted={(profile, preferredMuscles) => {
          const program = generateWorkoutProgram(profile, seedData);
          setAppState({ profile, preferredMuscles, program });
        }}
      />
    );
  }

  const firstDayPlan = appState.program.weeklyPlan[0];
  if (!firstDayPlan) {
    return (
      <OnboardingScreen
        store={onboardingStore}
        onCompleted={(profile, preferredMuscles) => {
          const program = generateWorkoutProgram(profile, seedData);
          setAppState({ profile, preferredMuscles, program });
        }}
      />
    );
  }

  return <ActiveWorkoutScreen dayPlan={firstDayPlan} exerciseNameById={exerciseNameById} />;
}
