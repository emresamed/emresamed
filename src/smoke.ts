import { generateWorkoutPlan } from "./generator/programGenerator.js";
import { OnboardingStore } from "./onboarding/onboardingStore.js";
import type { SeedData } from "./domain/types.js";

const demoSeed: SeedData = {
  schemaVersion: "1.0.0",
  exercises: [
    {
      id: "demo-push-up",
      name: "Demo Push-Up",
      primaryMuscle: "chest",
      primaryTargetZone: "mid_chest",
      secondaryMuscles: ["shoulders", "arms"],
      mechanics: "compound",
      movementType: "horizontal_push",
      equipment: ["bodyweight"],
      difficulty: "beginner",
      contraindicationTags: [],
    },
    {
      id: "demo-row",
      name: "Demo Row",
      primaryMuscle: "back",
      primaryTargetZone: "mid_back",
      secondaryMuscles: ["arms"],
      mechanics: "compound",
      movementType: "horizontal_pull",
      equipment: ["bodyweight"],
      difficulty: "beginner",
      contraindicationTags: [],
    },
  ],
  weeklySplitTemplates: [
    {
      id: "demo-template",
      name: "Demo Full Body",
      splitType: "full_body",
      bodyType: "ectomorph",
      daysPerWeek: 2,
      trainingDays: [
        {
          dayIndex: 1,
          name: "Day 1",
          focus: ["chest", "back"],
          exerciseSlots: [
            {
              slotId: "push",
              primaryMuscle: "chest",
              targetZones: ["mid_chest"],
              mechanics: "compound",
              movementType: "horizontal_push",
              sets: { min: 2, max: 3 },
              reps: { min: 8, max: 15 },
              rpe: { min: 6, max: 8 },
              restSeconds: { min: 60, max: 120 },
              candidateExerciseIds: ["demo-push-up"],
            },
            {
              slotId: "pull",
              primaryMuscle: "back",
              targetZones: ["mid_back"],
              mechanics: "compound",
              movementType: "horizontal_pull",
              sets: { min: 2, max: 3 },
              reps: { min: 8, max: 15 },
              rpe: { min: 6, max: 8 },
              restSeconds: { min: 60, max: 120 },
              candidateExerciseIds: ["demo-row"],
            },
          ],
        },
        {
          dayIndex: 2,
          name: "Day 2",
          focus: ["chest", "back"],
          exerciseSlots: [],
        },
      ],
    },
  ],
};

export function runSmokeDemo(): number {
  const store = new OnboardingStore();
  store.dispatch({ type: "set-body-type", bodyType: "ectomorph" });
  store.dispatch({ type: "set-goals", goals: ["hypertrophy"] });
  store.dispatch({ type: "set-available-equipment", equipment: ["bodyweight"] });
  store.dispatch({ type: "set-days-per-week", daysPerWeek: 2 });
  store.dispatch({ type: "set-difficulty", difficulty: "beginner" });
  store.dispatch({ type: "complete" });

  const plan = generateWorkoutPlan({
    seedData: demoSeed,
    metrics: store.getState().metrics,
  });
  store.destroy();

  return plan.sessions.length;
}
