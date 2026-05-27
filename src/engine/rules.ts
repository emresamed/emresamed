import {
  BodyType,
  BodyTypeModifier,
  Goal,
  GoalBaseline,
  MovementType,
  MuscleGroup,
  RepRange
} from "../domain/types";

export const goalBaselines: Record<Goal, GoalBaseline> = {
  strength: {
    weeklySets: {
      large: { min: 10, max: 14 },
      small: { min: 6, max: 10 }
    },
    reps: {
      compound: { min: 3, max: 6 },
      isolation: { min: 6, max: 10 }
    },
    targetRPE: [7.5, 9.5],
    restSec: {
      compound: [180, 300],
      isolation: [90, 150]
    },
    compoundIsolationRatio: [0.75, 0.25]
  },
  hypertrophy: {
    weeklySets: {
      large: { min: 12, max: 20 },
      small: { min: 8, max: 14 }
    },
    reps: {
      compound: { min: 6, max: 12 },
      isolation: { min: 10, max: 15 }
    },
    targetRPE: [7, 9],
    restSec: {
      compound: [90, 180],
      isolation: [45, 90]
    },
    compoundIsolationRatio: [0.6, 0.4]
  },
  fat_loss: {
    weeklySets: {
      large: { min: 10, max: 16 },
      small: { min: 6, max: 12 }
    },
    reps: {
      compound: { min: 8, max: 15 },
      isolation: { min: 12, max: 20 }
    },
    targetRPE: [6.5, 8],
    restSec: {
      compound: [60, 120],
      isolation: [30, 60]
    },
    compoundIsolationRatio: [0.5, 0.5]
  }
};

export const bodyTypeModifiers: Record<BodyType, BodyTypeModifier> = {
  ectomorph: {
    volumeMultiplier: 1.1,
    intensityPctDelta: -2,
    rpeDelta: -0.25,
    restMultiplier: 1.1
  },
  mesomorph: {
    volumeMultiplier: 1,
    intensityPctDelta: 0,
    rpeDelta: 0,
    restMultiplier: 1
  },
  endomorph: {
    volumeMultiplier: 0.95,
    intensityPctDelta: -1,
    rpeDelta: -0.25,
    restMultiplier: 0.9
  }
};

const largeMuscles: ReadonlySet<MuscleGroup> = new Set([
  "chest",
  "back",
  "legs",
  "shoulders"
]);

export function isLargeMuscle(muscle: MuscleGroup): boolean {
  return largeMuscles.has(muscle);
}

export function midpoint(range: RepRange): number {
  return (range.min + range.max) / 2;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export interface EffectivePrescription {
  reps: RepRange;
  targetRPE: number;
  restSec: number;
}

export function getEffectivePrescription(
  goal: Goal,
  bodyType: BodyType,
  movementType: MovementType
): EffectivePrescription {
  const goalRule = goalBaselines[goal];
  const modifier = bodyTypeModifiers[bodyType];
  const repRange = goalRule.reps[movementType];

  const targetRPE = clamp(
    midpoint({ min: goalRule.targetRPE[0], max: goalRule.targetRPE[1] }) +
      modifier.rpeDelta,
    6,
    9.5
  );
  const restSec = Math.round(
    midpoint({
      min: goalRule.restSec[movementType][0],
      max: goalRule.restSec[movementType][1]
    }) * modifier.restMultiplier
  );

  return {
    reps: repRange,
    targetRPE,
    restSec
  };
}

export function getWeeklySetTarget(
  goal: Goal,
  bodyType: BodyType,
  muscle: MuscleGroup
): number {
  const goalRule = goalBaselines[goal];
  const modifier = bodyTypeModifiers[bodyType];
  const muscleRule = isLargeMuscle(muscle)
    ? goalRule.weeklySets.large
    : goalRule.weeklySets.small;
  return Math.max(4, Math.round(midpoint(muscleRule) * modifier.volumeMultiplier));
}
