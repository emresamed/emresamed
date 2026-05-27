import { describe, expect, it } from "vitest";
import { seedData } from "../src/data/seedData";
import { BodyType, Goal, UserMetrics } from "../src/domain/types";
import {
  generateWorkoutProgram,
  safeGenerateWorkoutProgram
} from "../src/engine/workoutGenerator";

const bodyTypes: BodyType[] = ["ectomorph", "mesomorph", "endomorph"];
const goals: Goal[] = ["strength", "hypertrophy", "fat_loss"];

function buildProfile(bodyType: BodyType, goal: Goal): UserMetrics {
  return {
    bodyType,
    goal,
    trainingAge: "intermediate",
    daysPerWeek: 4,
    equipmentOwned: ["barbell", "dumbbell", "machine", "cable", "bodyweight"]
  };
}

describe("generateWorkoutProgram", () => {
  it("creates valid output for all body type and goal combinations", () => {
    for (const bodyType of bodyTypes) {
      for (const goal of goals) {
        const profile = buildProfile(bodyType, goal);
        const program = generateWorkoutProgram(profile, seedData);

        expect(program.programMeta.bodyType).toBe(bodyType);
        expect(program.programMeta.goal).toBe(goal);
        expect(program.weeklyPlan.length).toBeGreaterThan(0);

        for (const day of program.weeklyPlan) {
          expect(day.exercises.length).toBeGreaterThan(0);

          for (const exercise of day.exercises) {
            expect(exercise.sets.length).toBeGreaterThan(0);
            for (const setEntry of exercise.sets) {
              expect(setEntry.repsMin).toBeGreaterThan(0);
              expect(setEntry.repsMax).toBeGreaterThanOrEqual(setEntry.repsMin);
              expect(setEntry.targetRPE).toBeGreaterThanOrEqual(6);
              expect(setEntry.targetRPE).toBeLessThanOrEqual(9.5);
              expect(setEntry.restSec).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  });

  it("keeps selected equipment constraints for generated exercises", () => {
    const profile: UserMetrics = {
      bodyType: "mesomorph",
      goal: "hypertrophy",
      trainingAge: "intermediate",
      daysPerWeek: 4,
      equipmentOwned: ["cable", "bodyweight"]
    };

    const program = generateWorkoutProgram(profile, seedData);
    const exerciseMap = new Map(seedData.exerciseSeed.map((exercise) => [exercise.id, exercise]));

    for (const day of program.weeklyPlan) {
      for (const workoutExercise of day.exercises) {
        const seedExercise = exerciseMap.get(workoutExercise.exerciseId);
        expect(seedExercise).toBeDefined();
        expect(
          seedExercise?.equipmentRequired.some(
            (required) => required === "cable" || required === "bodyweight"
          )
        ).toBe(true);
      }
    }
  });

  it("returns a safe error result for invalid generation input", () => {
    const result = safeGenerateWorkoutProgram({
      bodyType: "ectomorph",
      goal: "strength",
      trainingAge: "beginner",
      daysPerWeek: 4,
      equipmentOwned: []
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("equipmentOwned");
    }
  });
});
