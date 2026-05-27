import { supabase } from '@/lib/supabase';
import { Exercise, MuscleGroup } from '@/types';

export const exerciseService = {
  async getMuscleGroups(): Promise<MuscleGroup[]> {
    const { data, error } = await supabase
      .from('muscle_groups')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as MuscleGroup[];
  },

  async getExercises(filters?: {
    muscleGroupId?: string;
    difficulty?: string;
    search?: string;
  }): Promise<Exercise[]> {
    let query = supabase
      .from('exercises')
      .select('*, primary_muscle_group:muscle_groups(*)')
      .order('name');

    if (filters?.muscleGroupId) {
      query = query.eq('primary_muscle_group_id', filters.muscleGroupId);
    }
    if (filters?.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Exercise[];
  },

  async getExerciseById(id: string): Promise<Exercise> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*, primary_muscle_group:muscle_groups(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Exercise;
  },

  async getFavorites(userId: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('exercise:exercises(*, primary_muscle_group:muscle_groups(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    // supabase returns nested join arrays; cast via unknown
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data ?? []) as any[]).map((row) => row.exercise as Exercise);
  },

  async toggleFavorite(userId: string, exerciseId: string): Promise<boolean> {
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .maybeSingle();

    if (existing) {
      await supabase.from('favorites').delete().eq('id', (existing as { id: string }).id);
      return false;
    }

    await supabase.from('favorites').insert({ user_id: userId, exercise_id: exerciseId });
    return true;
  },
};
