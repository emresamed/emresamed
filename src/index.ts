import { seedData } from "./data/seedData";
import { generateWorkoutProgram } from "./engine/workoutGenerator";
import { OnboardingStore } from "./state/onboardingStore";

export { seedData, generateWorkoutProgram, OnboardingStore };

if (require.main === module) {
  const onboardingStore = new OnboardingStore();
  onboardingStore.setBodyType("mesomorph");
  onboardingStore.setGoal("hypertrophy");
  onboardingStore.setDaysPerWeek(4);
  onboardingStore.setTrainingAge("intermediate");
  onboardingStore.setEquipment(["barbell", "dumbbell", "machine", "cable", "bodyweight"]);

  const profile = onboardingStore.complete();
  const program = generateWorkoutProgram(profile, seedData);

  // Prints a sample weekly plan for local verification.
  console.log(JSON.stringify(program, null, 2));
}
