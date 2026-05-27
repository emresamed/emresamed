import type { Exercise } from "../../types/domain";
import { supabase } from "../supabase/client";

export const listExercises = async (): Promise<Exercise[]> => {
  const { data, error } = await supabase
    .from("exercises")
    .select("id, name, muscle_group_id, equipment, difficulty")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    muscleGroupId: item.muscle_group_id,
    equipment: item.equipment,
    difficulty: item.difficulty
  }));
};
