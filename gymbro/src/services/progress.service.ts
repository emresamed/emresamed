import { supabase } from '@/lib/supabase';
import { UserProgress, PersonalRecord, WeeklyStats } from '@/types';

export const progressService = {
  // ---------------------------------------------------------------------------
  // Body weight / measurements
  // ---------------------------------------------------------------------------

  async getProgress(userId: string, limit = 90): Promise<UserProgress[]> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data ?? []) as UserProgress[];
  },

  async logProgress(
    userId: string,
    entry: Pick<UserProgress, 'recorded_at' | 'weight_kg' | 'body_fat_percentage' | 'notes'>
  ): Promise<UserProgress> {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert(
        { user_id: userId, ...entry },
        { onConflict: 'user_id,recorded_at' }
      )
      .select()
      .single();

    if (error) throw error;
    return data as UserProgress;
  },

  async deleteProgress(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_progress')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ---------------------------------------------------------------------------
  // Personal records — max weight lifted per exercise
  // Uses a Postgres aggregate via RPC or a JS reduce over log sets.
  // The JS approach keeps it portable without requiring a DB function.
  // ---------------------------------------------------------------------------

  async getPersonalRecords(userId: string): Promise<PersonalRecord[]> {
    const { data, error } = await supabase
      .from('workout_log_sets')
      .select(`
        weight_kg,
        workout_log_exercise:workout_log_exercises!inner (
          exercise_id,
          exercise_name,
          workout_log:workout_logs!inner (
            user_id,
            finished_at
          )
        )
      `)
      .eq('workout_log_exercises.workout_logs.user_id', userId)
      .eq('is_completed', true)
      .not('weight_kg', 'is', null)
      .order('weight_kg', { ascending: false });

    if (error) throw error;

    // Deduplicate: keep highest weight per exercise
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const records = new Map<string, PersonalRecord>();
    for (const row of (data ?? []) as any[]) {
      const ex = row.workout_log_exercise;
      if (!ex) continue;
      const existing = records.get(ex.exercise_id);
      if (!existing || row.weight_kg > existing.max_weight_kg) {
        records.set(ex.exercise_id, {
          exercise_id: ex.exercise_id,
          exercise_name: ex.exercise_name,
          max_weight_kg: row.weight_kg,
          achieved_at: ex.workout_log?.finished_at ?? '',
        });
      }
    }

    return Array.from(records.values()).sort(
      (a, b) => b.max_weight_kg - a.max_weight_kg
    );
  },

  // ---------------------------------------------------------------------------
  // Weekly stats — aggregated from workout_logs
  // ---------------------------------------------------------------------------

  async getWeeklyStats(userId: string, weeksBack = 12): Promise<WeeklyStats[]> {
    const since = new Date();
    since.setDate(since.getDate() - weeksBack * 7);

    const { data, error } = await supabase
      .from('workout_logs')
      .select(`
        finished_at,
        duration_seconds,
        workout_log_exercises (
          workout_log_sets (
            reps,
            weight_kg,
            is_completed
          )
        )
      `)
      .eq('user_id', userId)
      .gte('finished_at', since.toISOString())
      .order('finished_at');

    if (error) throw error;

    // Group by ISO week
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const weekMap = new Map<string, WeeklyStats>();

    for (const log of (data ?? []) as any[]) {
      const d = new Date(log.finished_at);
      const weekStart = getISOWeekStart(d).toISOString().split('T')[0];

      if (!weekMap.has(weekStart)) {
        weekMap.set(weekStart, {
          week_start: weekStart,
          total_workouts: 0,
          total_duration_seconds: 0,
          total_sets: 0,
          total_volume_kg: 0,
        });
      }

      const stats = weekMap.get(weekStart)!;
      stats.total_workouts += 1;
      stats.total_duration_seconds += log.duration_seconds ?? 0;

      for (const ex of log.workout_log_exercises ?? []) {
        for (const s of ex.workout_log_sets ?? []) {
          if (!s.is_completed) continue;
          stats.total_sets += 1;
          if (s.reps && s.weight_kg) {
            stats.total_volume_kg += s.reps * s.weight_kg;
          }
        }
      }
    }

    return Array.from(weekMap.values()).sort((a, b) =>
      a.week_start.localeCompare(b.week_start)
    );
  },
};

function getISOWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
