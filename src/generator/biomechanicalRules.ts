import { type BodyType, type Goal, type Mechanics, type MuscleGroup, type Range } from "../domain/types.js";

export interface GoalPrescription {
  readonly compoundSets: Range<number>;
  readonly isolationSets: Range<number>;
  readonly compoundReps: Range<number>;
  readonly isolationReps: Range<number>;
  readonly rpe: Range<number>;
  readonly restCompoundSeconds: Range<number>;
  readonly restIsolationSeconds: Range<number>;
}

export interface BodyTypeModifier {
  readonly weeklyVolumeMultiplier: number;
  readonly setCapPerSessionPerMuscle: number;
  readonly restShiftSeconds: Range<number>;
}

export const GOAL_PRESCRIPTIONS: Record<Goal, GoalPrescription> = {
  strength: {
    compoundSets: { min: 3, max: 6 },
    isolationSets: { min: 2, max: 4 },
    compoundReps: { min: 1, max: 6 },
    isolationReps: { min: 4, max: 8 },
    rpe: { min: 7.5, max: 9.5 },
    restCompoundSeconds: { min: 180, max: 300 },
    restIsolationSeconds: { min: 90, max: 180 },
  },
  hypertrophy: {
    compoundSets: { min: 3, max: 5 },
    isolationSets: { min: 2, max: 4 },
    compoundReps: { min: 6, max: 10 },
    isolationReps: { min: 10, max: 15 },
    rpe: { min: 7, max: 9 },
    restCompoundSeconds: { min: 90, max: 150 },
    restIsolationSeconds: { min: 60, max: 120 },
  },
  fat_loss: {
    compoundSets: { min: 2, max: 4 },
    isolationSets: { min: 2, max: 4 },
    compoundReps: { min: 8, max: 12 },
    isolationReps: { min: 12, max: 20 },
    rpe: { min: 6.5, max: 8.5 },
    restCompoundSeconds: { min: 45, max: 120 },
    restIsolationSeconds: { min: 30, max: 90 },
  },
  endurance: {
    compoundSets: { min: 2, max: 4 },
    isolationSets: { min: 2, max: 3 },
    compoundReps: { min: 12, max: 20 },
    isolationReps: { min: 15, max: 30 },
    rpe: { min: 6, max: 8 },
    restCompoundSeconds: { min: 45, max: 90 },
    restIsolationSeconds: { min: 30, max: 75 },
  },
};

export const BODY_TYPE_MODIFIERS: Record<BodyType, BodyTypeModifier> = {
  ectomorph: {
    weeklyVolumeMultiplier: 0.9,
    setCapPerSessionPerMuscle: 8,
    restShiftSeconds: { min: 15, max: 30 },
  },
  mesomorph: {
    weeklyVolumeMultiplier: 1,
    setCapPerSessionPerMuscle: 10,
    restShiftSeconds: { min: 0, max: 0 },
  },
  endomorph: {
    weeklyVolumeMultiplier: 1.1,
    setCapPerSessionPerMuscle: 10,
    restShiftSeconds: { min: -30, max: -15 },
  },
};

export const MINIMUM_WEEKLY_SETS: Record<MuscleGroup, number> = {
  chest: 8,
  back: 10,
  legs: 10,
  shoulders: 6,
  arms: 4,
  core: 4,
};

export function scoreExerciseForGoal(goal: Goal, mechanics: Mechanics, movementType: string, difficultyWeight: number): number {
  let score = difficultyWeight;

  if (goal === "strength") {
    score += mechanics === "compound" ? 12 : 2;
    if (movementType.includes("push") || movementType.includes("pull") || movementType.includes("squat")) {
      score += 3;
    }
  }

  if (goal === "hypertrophy") {
    score += mechanics === "compound" ? 8 : 6;
    if (movementType.includes("raise") || movementType.includes("curl") || movementType.includes("extension")) {
      score += 2;
    }
  }

  if (goal === "fat_loss") {
    score += mechanics === "compound" ? 9 : 4;
    if (movementType.includes("carry") || movementType.includes("lunge") || movementType.includes("hinge")) {
      score += 3;
    }
  }

  if (goal === "endurance") {
    score += mechanics === "isolation" ? 6 : 7;
    if (
      movementType.includes("carry") ||
      movementType.includes("anti") ||
      movementType.includes("machine") ||
      movementType.includes("cable")
    ) {
      score += 3;
    }
  }

  return score;
}
