/**
 * Zustand store registry.
 *
 * Convention:
 * - One slice per file: useAuthStore, useWorkoutSessionStore, useUIStore, …
 * - Each slice owns ONLY client state — never duplicate server data (use React Query).
 * - Re-export hooks from here so consumers do `import { useAuthStore } from '@/store'`.
 *
 * Slices are added in their respective phases:
 *   Phase 2 → useAuthStore
 *   Phase 5 → useWorkoutSessionStore, useTimerStore
 */
export {};
