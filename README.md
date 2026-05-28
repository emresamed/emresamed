# emresamed — Mobile Fitness

Type-safe core, deterministic workout generator, and a premium dark-mode UI for
the mobile fitness application.

## Layout

- `docs/` — domain blueprint (rules, schemas, progression algorithms).
- `data/seeds/` — JSON seed data (exercises, weekly split templates).
- `src/` — strict TypeScript core (`OnboardingStore`, `generateWorkoutPlan`,
  domain types, biomechanical rules).
- `ui/` — React (TSX) presentation layer with the Active Workout screen,
  onboarding flow, and shared design system.

## Scripts

```bash
npm run typecheck      # core typecheck
npm run typecheck:ui   # ui typecheck (React)
npm run build          # emit core to dist/
npm test               # core + ui typechecks
```

## UI module

The UI module is dark-mode-first, mobile-viewport optimized, and binds to the
core stores via tiny observable adapters (`ui/hooks/useStore.ts`). Highlights:

- **Active Workout Screen** (`ui/components/workout/ActiveWorkoutScreen.tsx`) —
  current-exercise focus card, set checkboxes, target rep ranges, RPE/rest
  badges, and a dynamic `RestTimer` driven by a state-machine reducer.
- **Onboarding Flow** (`ui/components/onboarding/OnboardingFlow.tsx`) — body
  type, goal, equipment, days/week, and difficulty pickers wired straight into
  the core `OnboardingStore`.
- **Muscle Group Cards** (`ui/components/onboarding/MuscleGroupCard.tsx`) —
  per-muscle accent colors, animated icon glyphs, and weekly volume hints.

Design tokens live in `ui/theme/tokens.ts`. Animations respect
`prefers-reduced-motion`, and all interactive controls expose proper ARIA
roles, labels, and focus-visible outlines.
