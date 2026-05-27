import { supabase } from '@/lib/supabase';
import { WorkoutProgram, WorkoutDay, WorkoutExercise, WorkoutLog } from '@/types';

export const workoutService = {
  async getPrograms(filters?: { difficulty?: string; goal?: string }): Promise<WorkoutProgram[]> {
    let query = supabase
      .from('workout_programs')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (filters?.difficulty) query = query.eq('difficulty', filters.difficulty);
    if (filters?.goal) query = query.eq('goal', filters.goal);

    const { data, error } = await query;
    if (error) throw error;
    return data as WorkoutProgram[];
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

  async getWorkoutDays(programId: string): Promise<WorkoutDay[]> {
    const { data, error } = await supabase
      .from('workout_days')
      .select('*')
      .eq('program_id', programId)
      .order('day_number');

    if (error) throw error;
    return data as WorkoutDay[];
  },

  async getWorkoutExercises(dayId: string): Promise<WorkoutExercise[]> {
    const { data, error } = await supabase
      .from('workout_exercises')
      .select('*, exercise:exercises(*, primary_muscle_group:muscle_groups(*))')
      .eq('workout_day_id', dayId)
      .order('order_index');

    if (error) throw error;
    return data as WorkoutExercise[];
  },

  async saveWorkoutLog(log: Omit<WorkoutLog, 'id' | 'created_at'>): Promise<WorkoutLog> {
    const { data, error } = await supabase
      .from('workout_logs')
      .insert(log)
      .select()
      .single();

    if (error) throw error;
    return data as WorkoutLog;
  },

  async getWorkoutLogs(userId: string, limit = 20): Promise<WorkoutLog[]> {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', userId)
      .order('finished_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as WorkoutLog[];
  },
};
