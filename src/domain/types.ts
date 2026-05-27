export const BODY_TYPES = ["ectomorph", "mesomorph", "endomorph"] as const;
export const GOALS = ["strength", "hypertrophy", "fat_loss"] as const;
export const TRAINING_AGES = ["beginner", "intermediate", "advanced"] as const;
export const MOVEMENT_TYPES = ["compound", "isolation"] as const;
export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

export type BodyType = (typeof BODY_TYPES)[number];
export type Goal = (typeof GOALS)[number];
export type TrainingAge = (typeof TRAINING_AGES)[number];
export type MovementType = (typeof MOVEMENT_TYPES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];

export type MuscleGroup =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core";

export interface UserMetrics {
  bodyType: BodyType;
  goal: Goal;
  equipmentOwned: string[];
  daysPerWeek: number;
  trainingAge: TrainingAge;
}

export interface OnboardingDraft {
  bodyType?: BodyType;
  goal?: Goal;
  equipmentOwned: string[];
  daysPerWeek?: number;
  trainingAge?: TrainingAge;
}

export interface OnboardingState {
  status: "collecting" | "completed";
  draft: OnboardingDraft;
  errors: string[];
}

export interface ExerciseSeedItem {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscle: string;
  movementType: MovementType;
  equipmentRequired: string[];
  difficulty: Difficulty;
  targetZone: string;
}

export interface SplitDay {
  dayIndex: number;
  focusLabel: string;
  targetMuscles: MuscleGroup[];
}

export interface SplitAdaptation {
  daysPerWeek: number;
  volumeMultiplier: number;
  intensityPct1RMRange: [number, number];
  restMultiplier: number;
  compoundIsolationRatio: [number, number];
  weekLayout: SplitDay[];
}

export interface SplitTemplate {
  id: string;
  name: string;
  daysPerWeekMin: number;
  daysPerWeekMax: number;
  adaptations: Record<BodyType, SplitAdaptation>;
}

export interface SeedData {
  seedVersion: string;
  exerciseSeed: ExerciseSeedItem[];
  splitTemplates: SplitTemplate[];
}

export interface RepRange {
  min: number;
  max: number;
}

export interface GoalBaseline {
  weeklySets: {
    large: RepRange;
    small: RepRange;
  };
  reps: Record<MovementType, RepRange>;
  targetRPE: [number, number];
  restSec: Record<MovementType, [number, number]>;
  compoundIsolationRatio: [number, number];
}

export interface BodyTypeModifier {
  volumeMultiplier: number;
  intensityPctDelta: number;
  rpeDelta: number;
  restMultiplier: number;
}

export interface WorkoutSet {
  repsMin: number;
  repsMax: number;
  targetRPE: number;
  restSec: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface WorkoutDayPlan {
  dayIndex: number;
  focus: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutProgram {
  programMeta: {
    goal: Goal;
    bodyType: BodyType;
    mesocycleWeek: number;
  };
  weeklyPlan: WorkoutDayPlan[];
}
