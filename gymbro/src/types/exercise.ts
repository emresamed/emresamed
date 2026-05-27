export interface MuscleGroup {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  color: string;
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentType =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'resistance_band'
  | 'kettlebell'
  | 'other';

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  instructions: string[];
  difficulty: Difficulty;
  equipment: EquipmentType[];
  primary_muscle_group_id: string;
  secondary_muscle_group_ids: string[];
  video_url: string | null;
  thumbnail_url: string | null;
  calories_per_minute: number | null;
  created_at: string;
  // Joined
  primary_muscle_group?: MuscleGroup;
}
