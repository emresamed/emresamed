import { Exercise } from './exercise';

export type ProgramDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ProgramGoal =
  | 'muscle_gain'
  | 'weight_loss'
  | 'strength'
  | 'endurance'
  | 'general_fitness';

// ---------------------------------------------------------------------------
// Programs & structure
// ---------------------------------------------------------------------------

export interface WorkoutProgram {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  difficulty: ProgramDifficulty;
  goal: ProgramGoal;
  duration_weeks: number;
  days_per_week: number;
  created_by: string | null;
  is_public: boolean;
  created_at: string;
}

export interface WorkoutDay {
  id: string;
  program_id: string;
  day_number: number;
  name: string;
  description: string | null;
}

export interface WorkoutExercise {
  id: string;
  workout_day_id: string;
  exercise_id: string;
  order_index: number;
  sets: number;
  reps_min: number | null;
  reps_max: number | null;
  duration_seconds: number | null;
  rest_seconds: number;
  notes: string | null;
  // Joined via Supabase foreign-key select
  exercise?: Exercise;
}

// ---------------------------------------------------------------------------
// Active session (client-side only — lives in workoutStore)
// ---------------------------------------------------------------------------

export interface ActiveSet {
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
  is_completed: boolean;
}

export interface ActiveExercise {
  exercise_id: string;
  exercise_name: string;
  sets: ActiveSet[];
}

export interface ActiveSession {
  workout_day_id: string | null;
  program_id: string | null;
  started_at: string;
  exercises: ActiveExercise[];
  notes: string | null;
}

// ---------------------------------------------------------------------------
// Persisted workout history (normalized — matches DB tables)
// ---------------------------------------------------------------------------

export interface WorkoutLogSet {
  id: string;
  workout_log_exercise_id: string;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
  is_completed: boolean;
}

export interface WorkoutLogExercise {
  id: string;
  workout_log_id: string;
  exercise_id: string;
  exercise_name: string;
  order_index: number;
  // Joined
  sets?: WorkoutLogSet[];
  exercise?: Exercise;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_day_id: string | null;
  program_id: string | null;
  started_at: string;
  finished_at: string;
  duration_seconds: number;
  notes: string | null;
  created_at: string;
  // Joined
  workout_log_exercises?: WorkoutLogExercise[];
}

// ---------------------------------------------------------------------------
// Input types for saving a completed session
// ---------------------------------------------------------------------------

export interface SaveWorkoutLogInput {
  user_id: string;
  workout_day_id: string | null;
  program_id: string | null;
  started_at: string;
  finished_at: string;
  duration_seconds: number;
  notes: string | null;
  exercises: Array<{
    exercise_id: string;
    exercise_name: string;
    order_index: number;
    sets: Array<{
      set_number: number;
      reps: number | null;
      weight_kg: number | null;
      duration_seconds: number | null;
      is_completed: boolean;
    }>;
  }>;
}

// ---------------------------------------------------------------------------
// Progress tracking
// ---------------------------------------------------------------------------

export interface UserProgress {
  id: string;
  user_id: string;
  recorded_at: string;
  weight_kg: number | null;
  body_fat_percentage: number | null;
  notes: string | null;
  created_at: string;
}

export interface PersonalRecord {
  exercise_id: string;
  exercise_name: string;
  max_weight_kg: number;
  achieved_at: string;
}

export interface WeeklyStats {
  week_start: string;
  total_workouts: number;
  total_duration_seconds: number;
  total_sets: number;
  total_volume_kg: number;
}
