export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type ProgressMetric = 'weight' | 'reps' | 'body_weight' | 'one_rep_max';

export interface DbUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface MuscleGroup {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  created_at: string;
}

export interface Exercise {
  id: string;
  muscle_group_id: string;
  name: string;
  slug: string;
  description: string | null;
  instructions: string | null;
  equipment: string | null;
  difficulty: DifficultyLevel;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutProgram {
  id: string;
  created_by: string | null;
  title: string;
  slug: string;
  description: string | null;
  difficulty: DifficultyLevel;
  duration_weeks: number | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutDay {
  id: string;
  program_id: string;
  day_number: number;
  title: string;
  description: string | null;
  created_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_day_id: string;
  exercise_id: string;
  order_index: number;
  target_sets: number;
  target_reps: string;
  rest_seconds: number;
  notes: string | null;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  program_id: string | null;
  workout_day_id: string | null;
  title: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  notes: string | null;
  created_at: string;
}

export interface WorkoutLogSet {
  id: string;
  workout_log_id: string;
  exercise_id: string;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  is_completed: boolean;
  completed_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  exercise_id: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  exercise_id: string | null;
  workout_log_id: string | null;
  metric: ProgressMetric;
  value: number;
  unit: string;
  recorded_at: string;
  notes: string | null;
  created_at: string;
}

// Joined / enriched types for UI layers

export interface ExerciseWithMuscleGroup extends Exercise {
  muscle_group: MuscleGroup;
}

export interface WorkoutDayWithExercises extends WorkoutDay {
  exercises: (WorkoutExercise & { exercise: Exercise })[];
}

export interface WorkoutProgramWithDays extends WorkoutProgram {
  days: WorkoutDayWithExercises[];
}

export interface WorkoutLogWithSets extends WorkoutLog {
  sets: (WorkoutLogSet & { exercise: Exercise })[];
}
