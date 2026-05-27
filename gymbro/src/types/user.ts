export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  weight_kg: number | null;
  height_cm: number | null;
  fitness_goal: FitnessGoal | null;
  created_at: string;
  updated_at: string;
}

export type FitnessGoal =
  | 'muscle_gain'
  | 'weight_loss'
  | 'strength'
  | 'endurance'
  | 'general_fitness';
