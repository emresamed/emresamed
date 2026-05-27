export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const
  },
  exercises: {
    all: ["exercises"] as const,
    byMuscleGroup: (muscleGroupId: string) => ["exercises", "muscle-group", muscleGroupId] as const,
    detail: (exerciseId: string) => ["exercises", exerciseId] as const
  },
  programs: {
    all: ["programs"] as const,
    detail: (programId: string) => ["programs", programId] as const
  }
} as const;
