import { useEffect, useState } from "react";

/**
 * Generic React binding for an observable store with the shape:
 *   `{ getState(): T; subscribe(listener: (state: T) => void): () => void }`.
 *
 * Used to integrate the core `OnboardingStore` (and the local
 * `WorkoutSessionStore`) without forcing a particular state library.
 */
export interface ObservableStore<T> {
  getState(): T;
  subscribe(listener: (state: T) => void): () => void;
}

export function useStore<T>(store: ObservableStore<T>): T {
  const [snapshot, setSnapshot] = useState<T>(() => store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe((next) => {
      setSnapshot(next);
    });
    return () => {
      unsubscribe();
    };
  }, [store]);

  return snapshot;
}
