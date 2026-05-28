import { useEffect, useState } from "react";

/**
 * Tracks the user's `prefers-reduced-motion` setting at runtime so animation
 * components can disable non-essential motion immediately on toggle.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent): void => {
      setReduced(event.matches);
    };
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}
