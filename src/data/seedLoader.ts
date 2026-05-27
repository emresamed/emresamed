import { SeedData } from "../domain/types";
import { seedData } from "./seedData";

export function loadSeedData(): SeedData {
  try {
    assertSeedData(seedData);
    return seedData;
  } catch (error) {
    throw new Error(
      `Seed data loading failed: ${error instanceof Error ? error.message : "unknown error"}`
    );
  }
}

function assertSeedData(data: SeedData): void {
  if (!data || !Array.isArray(data.exerciseSeed) || !Array.isArray(data.splitTemplates)) {
    throw new Error("Seed data shape is invalid");
  }
  if (data.exerciseSeed.length === 0) {
    throw new Error("Exercise seed is empty");
  }
  if (data.splitTemplates.length === 0) {
    throw new Error("Split templates are empty");
  }
}
