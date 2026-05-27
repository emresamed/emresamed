export type MuscleGroup = {
  id: string;
  name: string;
  imageUrl?: string | null;
};

export type Exercise = {
  id: string;
  name: string;
  muscleGroupId: string;
  equipment?: string | null;
  difficulty?: "beginner" | "intermediate" | "advanced";
};

export type WorkoutProgram = {
  id: string;
  title: string;
  description?: string | null;
  level: "beginner" | "intermediate" | "advanced";
  daysPerWeek: number;
};
