import type { WorkoutProgram } from "../../types/domain";
import { getSupabaseClient } from "../supabase/client";

export const listWorkoutPrograms = async (): Promise<WorkoutProgram[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("workout_programs")
    .select("id, title, description, level, days_per_week")
    .order("title", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    level: item.level,
    daysPerWeek: item.days_per_week
  }));
};
