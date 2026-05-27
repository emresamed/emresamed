import { useCallback, useMemo, useState } from "react";
import { WorkoutDayPlan } from "../../domain/types";

interface SetCompletionState {
  exerciseId: string;
  setIndex: number;
}

export interface ActiveWorkoutSession {
  currentExerciseIndex: number;
  totalExercises: number;
  currentExercise: WorkoutDayPlan["exercises"][number] | null;
  completedSets: SetCompletionState[];
  completionRate: number;
  toggleSet: (exerciseId: string, setIndex: number) => void;
  nextExercise: () => void;
  previousExercise: () => void;
}

export function useActiveWorkoutSession(dayPlan: WorkoutDayPlan): ActiveWorkoutSession {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<SetCompletionState[]>([]);

  const totalExercises = dayPlan.exercises.length;
  const currentExercise = dayPlan.exercises[currentExerciseIndex] ?? null;

  const toggleSet = useCallback((exerciseId: string, setIndex: number) => {
    setCompletedSets((prev) => {
      const existingIndex = prev.findIndex(
        (entry) => entry.exerciseId === exerciseId && entry.setIndex === setIndex
      );
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      }
      return [...prev, { exerciseId, setIndex }];
    });
  }, []);

  const nextExercise = useCallback(() => {
    setCurrentExerciseIndex((prev) => Math.min(prev + 1, Math.max(totalExercises - 1, 0)));
  }, [totalExercises]);

  const previousExercise = useCallback(() => {
    setCurrentExerciseIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const completionRate = useMemo(() => {
    const totalSets = dayPlan.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0);
    if (totalSets === 0) {
      return 0;
    }
    const checkedCount = completedSets.length;
    return checkedCount / totalSets;
  }, [completedSets, dayPlan.exercises]);

  return {
    currentExerciseIndex,
    totalExercises,
    currentExercise,
    completedSets,
    completionRate,
    toggleSet,
    nextExercise,
    previousExercise
  };
}
