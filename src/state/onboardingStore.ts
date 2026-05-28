import {
  BODY_TYPES,
  BodyType,
  GOALS,
  Goal,
  OnboardingDraft,
  OnboardingState,
  TRAINING_AGES,
  TrainingAge,
  UserMetrics
} from "../domain/types";

type OnboardingListener = (state: OnboardingState) => void;

const minimumDays = 2;
const maximumDays = 6;
const deepClone = <T>(value: T): T => {
  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
};

export class OnboardingStore {
  private state: OnboardingState = {
    status: "collecting",
    draft: { equipmentOwned: [] },
    errors: []
  };

  private listeners = new Set<OnboardingListener>();

  getState(): OnboardingState {
    return deepClone(this.state);
  }

  subscribe(listener: OnboardingListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
    };
  }

  setBodyType(bodyType: BodyType): void {
    this.updateDraft({ bodyType });
  }

  setGoal(goal: Goal): void {
    this.updateDraft({ goal });
  }

  setEquipment(equipmentOwned: string[]): void {
    const unique = [...new Set(equipmentOwned.map((item) => item.trim()).filter(Boolean))];
    this.updateDraft({ equipmentOwned: unique });
  }

  setDaysPerWeek(daysPerWeek: number): void {
    this.updateDraft({ daysPerWeek });
  }

  setTrainingAge(trainingAge: TrainingAge): void {
    this.updateDraft({ trainingAge });
  }

  complete(): UserMetrics {
    const errors = validateDraft(this.state.draft);
    if (errors.length > 0) {
      this.state = {
        ...this.state,
        status: "collecting",
        errors
      };
      this.emit();
      throw new Error(`Onboarding validation failed: ${errors.join(", ")}`);
    }

    const completedDraft = this.state.draft as UserMetrics;
    this.state = {
      status: "completed",
      draft: deepClone(completedDraft),
      errors: []
    };
    this.emit();
    return deepClone(completedDraft);
  }

  reset(): void {
    this.state = {
      status: "collecting",
      draft: { equipmentOwned: [] },
      errors: []
    };
    this.emit();
  }

  private updateDraft(partial: Partial<OnboardingDraft>): void {
    const draft: OnboardingDraft = {
      ...this.state.draft,
      ...partial
    };
    this.state = {
      status: "collecting",
      draft,
      errors: validateDraft(draft, { soft: true })
    };
    this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this.getState());
    }
  }
}

export function validateDraft(
  draft: OnboardingDraft,
  options: { soft?: boolean } = {}
): string[] {
  const errors: string[] = [];

  if (!options.soft || draft.bodyType !== undefined) {
    if (!draft.bodyType || !BODY_TYPES.includes(draft.bodyType)) {
      errors.push("bodyType is required and must be valid");
    }
  }

  if (!options.soft || draft.goal !== undefined) {
    if (!draft.goal || !GOALS.includes(draft.goal)) {
      errors.push("goal is required and must be valid");
    }
  }

  if (!options.soft || draft.trainingAge !== undefined) {
    if (!draft.trainingAge || !TRAINING_AGES.includes(draft.trainingAge)) {
      errors.push("trainingAge is required and must be valid");
    }
  }

  if (!options.soft || draft.daysPerWeek !== undefined) {
    if (
      draft.daysPerWeek === undefined ||
      !Number.isInteger(draft.daysPerWeek) ||
      draft.daysPerWeek < minimumDays ||
      draft.daysPerWeek > maximumDays
    ) {
      errors.push(`daysPerWeek must be an integer between ${minimumDays}-${maximumDays}`);
    }
  }

  if (!Array.isArray(draft.equipmentOwned)) {
    errors.push("equipmentOwned must be an array");
  }

  return errors;
}
