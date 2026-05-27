import { Exercise } from './exercise';

export type ProgramDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ProgramGoal =
  | 'muscle_gain'
  | 'weight_loss'
  | 'strength'
  | 'endurance'
  | 'general_fitness';

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
  // Joined
  exercise?: Exercise;
}

// Active session types
export interface WorkoutSetLog {
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
  is_completed: boolean;
}

export interface WorkoutExerciseLog {
  exercise_id: string;
  exercise_name: string;
  sets: WorkoutSetLog[];
}

export interface WorkoutSession {
  workout_day_id: string | null;
  program_id: string | null;
  started_at: string;
  exercises: WorkoutExerciseLog[];
  notes: string | null;
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
  exercises: WorkoutExerciseLog[];
  created_at: string;
}
