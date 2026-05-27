// ─── Primitive Enumerations ──────────────────────────────────────────────────

export type BodyType = 'ECTOMORPH' | 'MESOMORPH' | 'ENDOMORPH';

export type Goal = 'STRENGTH' | 'HYPERTROPHY' | 'FAT_LOSS';

export type MuscleGroup = 'CHEST' | 'BACK' | 'LEGS' | 'SHOULDERS' | 'ARMS' | 'CORE';

export type Equipment =
  | 'BARBELL'
  | 'DUMBBELL'
  | 'CABLE'
  | 'MACHINE'
  | 'BODYWEIGHT'
  | 'KETTLEBELL'
  | 'RESISTANCE_BAND'
  | 'PULL_UP_BAR';

export type Mechanics = 'COMPOUND' | 'ISOLATION';

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type TargetZone =
  | 'UPPER_CHEST'
  | 'MID_CHEST'
  | 'LOWER_CHEST'
  | 'UPPER_BACK'
  | 'MID_BACK'
  | 'LOWER_BACK'
  | 'QUADS'
  | 'HAMSTRINGS'
  | 'GLUTES'
  | 'CALVES'
  | 'ANTERIOR_DELT'
  | 'LATERAL_DELT'
  | 'POSTERIOR_DELT'
  | 'BICEPS'
  | 'TRICEPS'
  | 'FOREARMS'
  | 'UPPER_ABS'
  | 'LOWER_ABS'
  | 'OBLIQUES'
  | 'TVA';

export type MovementPattern =
  | 'HORIZONTAL_PUSH'
  | 'HORIZONTAL_PULL'
  | 'VERTICAL_PUSH'
  | 'VERTICAL_PULL'
  | 'HIP_HINGE'
  | 'SQUAT'
  | 'LUNGE'
  | 'ROTATION'
  | 'CARRY'
  | 'ISOLATION_CURL'
  | 'ISOLATION_EXTENSION'
  | 'ISOLATION_FLY'
  | 'CORE_STABILIZATION';

export type SplitType = 'PUSH_PULL_LEGS' | 'UPPER_LOWER' | 'FULL_BODY' | 'BRO_SPLIT';

export type ProgressionModel = 'LINEAR' | 'DOUBLE_PROGRESSIVE' | 'VOLUME_PROGRESSIVE';

export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type BiologicalSex = 'MALE' | 'FEMALE' | 'OTHER';

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  mechanics: Mechanics;
  equipment: Equipment[];
  difficulty: Difficulty;
  targetZone: TargetZone;
  movementPattern: MovementPattern;
  unilateral: boolean;
  videoRef?: string;
}

export interface UserBodyMetrics {
  weightKg?: number;
  heightCm?: number;
  ageYears?: number;
  biologicalSex?: BiologicalSex;
}

export interface UserProfile {
  id: string;
  bodyType: BodyType;
  primaryGoal: Goal;
  availableEquipment: Equipment[];
  trainingDaysPerWeek: number;
  experienceLevel: ExperienceLevel;
  bodyMetrics?: UserBodyMetrics;
  createdAt: string;
  updatedAt?: string;
}

export interface VolumePrescription {
  bodyType: BodyType;
  goal: Goal;
  sets: number;
  repRangeLow: number;
  repRangeHigh: number;
  restSeconds: number;
  rpeTarget: number;
  intensityPctMin: number;
  intensityPctMax: number;
  progressionModel: ProgressionModel;
}

export interface ExerciseSlot {
  slotOrder: number;
  exerciseId: string;
  sets: number;
  repRangeLow: number;
  repRangeHigh: number;
  restSeconds: number;
  rpeTarget: number;
  notes?: string;
  isSuperset: boolean;
  supersetPartnerId?: string;
}

export interface WorkoutDay {
  id: string;
  dayIndex: number;
  label: string;
  isRestDay: boolean;
  muscleGroupFocus: MuscleGroup[];
  exerciseSlots: ExerciseSlot[];
}

export interface ProgressionPlan {
  model: ProgressionModel;
  deloadEveryNWeeks: number;
  loadIncrementUpperBodyKg: number;
  loadIncrementLowerBodyKg: number;
}

export interface WorkoutProgram {
  id: string;
  userId: string;
  splitType: SplitType;
  weeks: number;
  currentWeek: number;
  days: WorkoutDay[];
  progressionPlan: ProgressionPlan;
}

// ─── Session Entities ─────────────────────────────────────────────────────────

export interface SetLog {
  slotOrder: number;
  exerciseId: string;
  setNumber: number;
  targetReps?: number;
  actualReps?: number;
  loadKg?: number;
  rpe?: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface RestTimerState {
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  triggeredBySlotOrder?: number;
  triggeredBySetNumber?: number;
}

export interface ActiveWorkoutSession {
  id: string;
  userId: string;
  workoutDayId: string;
  startedAt: string;
  completedAt?: string;
  status: SessionStatus;
  setLogs: SetLog[];
  restTimerState: RestTimerState;
}

// ─── Split Template Types ─────────────────────────────────────────────────────

export interface DayTemplate {
  dayIndex: number;
  label: string;
  isRestDay: boolean;
  muscleGroupFocus: MuscleGroup[];
}

export interface SplitTemplate {
  splitType: SplitType;
  daysPerWeekMin: number;
  daysPerWeekMax: number;
  days: DayTemplate[];
}

// ─── Navigation Types ─────────────────────────────────────────────────────────

export type OnboardingStackParamList = {
  BodyType: undefined;
  Goal: { bodyType: BodyType };
  Equipment: { bodyType: BodyType; goal: Goal };
  DaysPerWeek: { bodyType: BodyType; goal: Goal; equipment: Equipment[] };
};

export type AppStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  ActiveWorkout: { workoutDayId: string };
  WorkoutSummary: { sessionId: string };
};
