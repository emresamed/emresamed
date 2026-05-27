/**
 * Zustand store registry.
 *
 * Convention:
 * - One slice per file: useAuthStore, useWorkoutSessionStore, useUIStore, …
 * - Each slice owns ONLY client state — never duplicate server data (use React Query).
 * - Re-export hooks from here so consumers do `import { useAuthStore } from '@/store'`.
 *
 * Slices added per phase:
 *   Phase 2 → useAuthStore                            ✓
 *   Phase 5 → useWorkoutSessionStore, useTimerStore
 */
export { useAuthStore, type AuthStatus } from './useAuthStore';
