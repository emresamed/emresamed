export const BODY_TYPES = ["ectomorph", "mesomorph", "endomorph"] as const;
export type BodyType = (typeof BODY_TYPES)[number];

export const GOALS = ["strength", "hypertrophy", "fat_loss", "endurance"] as const;
export type Goal = (typeof GOALS)[number];

export const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const MECHANICS = ["compound", "isolation"] as const;
export type Mechanics = (typeof MECHANICS)[number];

export const SPLIT_TYPES = ["push_pull_legs", "upper_lower", "full_body"] as const;
export type SplitType = (typeof SPLIT_TYPES)[number];

export const MUSCLE_GROUPS = ["chest", "back", "legs", "shoulders", "arms", "core"] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export interface Range<T extends number> {
  readonly min: T;
  readonly max: T;
}

export interface ExerciseSeed {
  readonly id: string;
  readonly name: string;
  readonly primaryMuscle: MuscleGroup;
  readonly primaryTargetZone: string;
  readonly secondaryMuscles: readonly MuscleGroup[];
  readonly mechanics: Mechanics;
  readonly movementType: string;
  readonly equipment: readonly string[];
  readonly difficulty: Difficulty;
  readonly unilateral?: boolean;
  readonly contraindicationTags?: readonly string[];
}

export interface ExerciseSlot {
  readonly slotId: string;
  readonly primaryMuscle: MuscleGroup;
  readonly targetZones: readonly string[];
  readonly mechanics: Mechanics;
  readonly movementType: string;
  readonly sets: Range<number>;
  readonly reps: Range<number>;
  readonly rpe: Range<number>;
  readonly restSeconds: Range<number>;
  readonly candidateExerciseIds?: readonly string[];
}

export interface TrainingDayTemplate {
  readonly dayIndex: number;
  readonly name: string;
  readonly focus: readonly MuscleGroup[];
  readonly exerciseSlots: readonly ExerciseSlot[];
}

export interface WeeklySplitTemplate {
  readonly id: string;
  readonly name: string;
  readonly splitType: SplitType;
  readonly bodyType: BodyType;
  readonly daysPerWeek: number;
  readonly trainingDays: readonly TrainingDayTemplate[];
}

export interface SeedData {
  readonly schemaVersion: string;
  readonly exercises: readonly ExerciseSeed[];
  readonly weeklySplitTemplates: readonly WeeklySplitTemplate[];
}

export interface UserMetrics {
  readonly bodyType: BodyType | undefined;
  readonly goals: readonly Goal[];
  readonly availableEquipment: readonly string[];
  readonly daysPerWeek: number | undefined;
  readonly difficulty: Difficulty;
  readonly contraindications: readonly string[];
}

export interface OnboardingState {
  readonly metrics: UserMetrics;
  readonly isComplete: boolean;
  readonly completedAt: string | undefined;
}

export interface WorkoutExercise {
  readonly dayIndex: number;
  readonly sessionName: string;
  readonly slotId: string;
  readonly exerciseId: string;
  readonly exerciseName: string;
  readonly primaryMuscle: MuscleGroup;
  readonly targetZone: string;
  readonly movementType: string;
  readonly mechanics: Mechanics;
  readonly prescribedSets: number;
  readonly repRange: Range<number>;
  readonly rpeRange: Range<number>;
  readonly restSeconds: Range<number>;
}

export interface WorkoutSession {
  readonly dayIndex: number;
  readonly name: string;
  readonly focus: readonly MuscleGroup[];
  readonly exercises: readonly WorkoutExercise[];
}

export interface GeneratedWorkoutPlan {
  readonly bodyType: BodyType;
  readonly goal: Goal;
  readonly daysPerWeek: number;
  readonly templateId: string;
  readonly sessions: readonly WorkoutSession[];
}
