import {
  type BodyType,
  type Difficulty,
  type Goal,
  type OnboardingState,
  type UserMetrics,
} from "../domain/types.js";

type OnboardingListener = (state: OnboardingState) => void;

export type OnboardingAction =
  | { readonly type: "set-body-type"; readonly bodyType: BodyType }
  | { readonly type: "set-goals"; readonly goals: readonly Goal[] }
  | { readonly type: "set-available-equipment"; readonly equipment: readonly string[] }
  | { readonly type: "set-days-per-week"; readonly daysPerWeek: number }
  | { readonly type: "set-difficulty"; readonly difficulty: Difficulty }
  | { readonly type: "set-contraindications"; readonly contraindications: readonly string[] }
  | { readonly type: "complete" }
  | { readonly type: "reset" };

const DEFAULT_METRICS: UserMetrics = {
  bodyType: undefined,
  goals: [],
  availableEquipment: [],
  daysPerWeek: undefined,
  difficulty: "beginner",
  contraindications: [],
};

const DEFAULT_STATE: OnboardingState = {
  metrics: DEFAULT_METRICS,
  isComplete: false,
  completedAt: undefined,
};

function uniqueSorted(input: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(input)].sort((left, right) => left.localeCompare(right)));
}

function uniqueGoals(goals: readonly Goal[]): readonly Goal[] {
  return Object.freeze([...new Set(goals)]);
}

function cloneState(state: OnboardingState): OnboardingState {
  return {
    metrics: {
      bodyType: state.metrics.bodyType,
      goals: [...state.metrics.goals],
      availableEquipment: [...state.metrics.availableEquipment],
      daysPerWeek: state.metrics.daysPerWeek,
      difficulty: state.metrics.difficulty,
      contraindications: [...state.metrics.contraindications],
    },
    isComplete: state.isComplete,
    completedAt: state.completedAt,
  };
}

export class OnboardingStore {
  private state: OnboardingState;

  private readonly listeners = new Set<OnboardingListener>();

  private destroyed = false;

  public constructor(initial?: Partial<UserMetrics>) {
    this.state = {
      metrics: {
        ...DEFAULT_METRICS,
        ...initial,
        goals: initial?.goals ? uniqueGoals(initial.goals) : [],
        availableEquipment: initial?.availableEquipment ? uniqueSorted(initial.availableEquipment) : [],
        contraindications: initial?.contraindications ? uniqueSorted(initial.contraindications) : [],
      },
      isComplete: false,
      completedAt: undefined,
    };
  }

  public getState(): OnboardingState {
    return cloneState(this.state);
  }

  public subscribe(listener: OnboardingListener): () => void {
    if (this.destroyed) {
      return () => undefined;
    }

    this.listeners.add(listener);
    listener(this.getState());

    let active = true;
    return () => {
      if (!active) {
        return;
      }
      active = false;
      this.listeners.delete(listener);
    };
  }

  public dispatch(action: OnboardingAction): OnboardingState {
    if (this.destroyed) {
      throw new Error("OnboardingStore is destroyed.");
    }

    this.state = reduceState(this.state, action);
    this.notify();
    return this.getState();
  }

  public destroy(): void {
    this.listeners.clear();
    this.destroyed = true;
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.getState());
    }
  }
}

function reduceState(current: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case "set-body-type":
      return {
        ...current,
        isComplete: false,
        completedAt: undefined,
        metrics: {
          ...current.metrics,
          bodyType: action.bodyType,
        },
      };
    case "set-goals":
      return {
        ...current,
        isComplete: false,
        completedAt: undefined,
        metrics: {
          ...current.metrics,
          goals: uniqueGoals(action.goals),
        },
      };
    case "set-available-equipment":
      return {
        ...current,
        isComplete: false,
        completedAt: undefined,
        metrics: {
          ...current.metrics,
          availableEquipment: uniqueSorted(action.equipment),
        },
      };
    case "set-days-per-week": {
      if (action.daysPerWeek < 2 || action.daysPerWeek > 6) {
        throw new Error("daysPerWeek must be between 2 and 6.");
      }

      return {
        ...current,
        isComplete: false,
        completedAt: undefined,
        metrics: {
          ...current.metrics,
          daysPerWeek: action.daysPerWeek,
        },
      };
    }
    case "set-difficulty":
      return {
        ...current,
        isComplete: false,
        completedAt: undefined,
        metrics: {
          ...current.metrics,
          difficulty: action.difficulty,
        },
      };
    case "set-contraindications":
      return {
        ...current,
        isComplete: false,
        completedAt: undefined,
        metrics: {
          ...current.metrics,
          contraindications: uniqueSorted(action.contraindications),
        },
      };
    case "complete":
      validateForCompletion(current.metrics);
      return {
        ...current,
        isComplete: true,
        completedAt: new Date().toISOString(),
      };
    case "reset":
      return cloneState(DEFAULT_STATE);
    default: {
      const unknownAction: never = action;
      throw new Error(`Unsupported onboarding action: ${JSON.stringify(unknownAction)}`);
    }
  }
}

function validateForCompletion(metrics: UserMetrics): void {
  if (!metrics.bodyType) {
    throw new Error("bodyType is required before completing onboarding.");
  }

  if (metrics.goals.length === 0) {
    throw new Error("At least one goal is required before completing onboarding.");
  }

  if (metrics.availableEquipment.length === 0) {
    throw new Error("At least one equipment option is required before completing onboarding.");
  }

  if (!metrics.daysPerWeek) {
    throw new Error("daysPerWeek is required before completing onboarding.");
  }
}
