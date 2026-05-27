import { supabase } from '@/lib/supabase';
import {
  WorkoutProgram,
  WorkoutDay,
  WorkoutExercise,
  WorkoutLog,
  SaveWorkoutLogInput,
} from '@/types';

export const workoutService = {
  // ---------------------------------------------------------------------------
  // Programs
  // ---------------------------------------------------------------------------

  async getPrograms(filters?: {
    difficulty?: string;
    goal?: string;
  }): Promise<WorkoutProgram[]> {
    let query = supabase
      .from('workout_programs')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (filters?.difficulty) query = query.eq('difficulty', filters.difficulty);
    if (filters?.goal) query = query.eq('goal', filters.goal);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as WorkoutProgram[];
  },

  async getProgramById(id: string): Promise<WorkoutProgram> {
    const { data, error } = await supabase
      .from('workout_programs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as WorkoutProgram;
  },

  // ---------------------------------------------------------------------------
  // Days & exercises
  // ---------------------------------------------------------------------------

  async getWorkoutDays(programId: string): Promise<WorkoutDay[]> {
    const { data, error } = await supabase
      .from('workout_days')
      .select('*')
      .eq('program_id', programId)
      .order('day_number');

    if (error) throw error;
    return (data ?? []) as WorkoutDay[];
  },

  async getWorkoutExercises(dayId: string): Promise<WorkoutExercise[]> {
    const { data, error } = await supabase
      .from('workout_exercises')
      .select('*, exercise:exercises(*, primary_muscle_group:muscle_groups(*))')
      .eq('workout_day_id', dayId)
      .order('order_index');

    if (error) throw error;
    return (data ?? []) as WorkoutExercise[];
  },

  // ---------------------------------------------------------------------------
  // Workout logs — save a completed session (3-step insert)
  // ---------------------------------------------------------------------------

  async saveWorkoutLog(input: SaveWorkoutLogInput): Promise<WorkoutLog> {
    // 1. Insert the log header
    const { data: logData, error: logError } = await supabase
      .from('workout_logs')
      .insert({
        user_id: input.user_id,
        workout_day_id: input.workout_day_id,
        program_id: input.program_id,
        started_at: input.started_at,
        finished_at: input.finished_at,
        duration_seconds: input.duration_seconds,
        notes: input.notes,
      })
      .select()
      .single();

    if (logError) throw logError;
    const log = logData as WorkoutLog;

    // 2. Insert each exercise row
    for (const ex of input.exercises) {
      const { data: exData, error: exError } = await supabase
        .from('workout_log_exercises')
        .insert({
          workout_log_id: log.id,
          exercise_id: ex.exercise_id,
          exercise_name: ex.exercise_name,
          order_index: ex.order_index,
        })
        .select()
        .single();

      if (exError) throw exError;
      const logExercise = exData as { id: string };

      // 3. Insert each set for this exercise
      if (ex.sets.length > 0) {
        const setsToInsert = ex.sets.map((s) => ({
          workout_log_exercise_id: logExercise.id,
          set_number: s.set_number,
          reps: s.reps,
          weight_kg: s.weight_kg,
          duration_seconds: s.duration_seconds,
          is_completed: s.is_completed,
        }));

        const { error: setsError } = await supabase
          .from('workout_log_sets')
          .insert(setsToInsert);

        if (setsError) throw setsError;
      }
    }

    return log;
  },

  // ---------------------------------------------------------------------------
  // Workout logs — fetch history with full detail
  // ---------------------------------------------------------------------------

  async getWorkoutLogs(userId: string, limit = 20): Promise<WorkoutLog[]> {
    const { data, error } = await supabase
      .from('workout_logs')
      .select(`
        *,
        workout_log_exercises (
          *,
          workout_log_sets (*),
          exercise:exercises (id, name, slug, primary_muscle_group_id)
        )
      `)
      .eq('user_id', userId)
      .order('finished_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []) as WorkoutLog[];
  },

  async getWorkoutLogById(logId: string): Promise<WorkoutLog> {
    const { data, error } = await supabase
      .from('workout_logs')
      .select(`
        *,
        workout_log_exercises (
          *,
          workout_log_sets (*),
          exercise:exercises (id, name, slug, primary_muscle_group_id)
        )
      `)
      .eq('id', logId)
      .single();

    if (error) throw error;
    return data as WorkoutLog;
  },

  async deleteWorkoutLog(logId: string): Promise<void> {
    const { error } = await supabase
      .from('workout_logs')
      .delete()
      .eq('id', logId);

    if (error) throw error;
  },
};
