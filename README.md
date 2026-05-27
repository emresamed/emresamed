# GymBro

GymBro is a modern fitness mobile app built feature-by-feature with Expo, React Native, TypeScript, Supabase, Zustand, React Query, NativeWind, and Lucide icons.

## Phase 1 foundation

This phase creates the project foundation only:

- Expo Router app entry
- strict TypeScript setup
- NativeWind/Tailwind dark theme setup
- app-wide provider boundary
- reusable UI primitives
- Zustand store skeleton
- React Query client configuration
- Supabase service boundary
- environment variable template

## Phase 2 authentication

This phase adds the MVP authentication system:

- login screen
- register screen
- forgot password screen
- Supabase email/password auth service
- session bootstrap and persistence
- protected app route group
- reusable form input, button, and status-message components
- auth hooks for session state and auth actions

Supabase tokens are stored through an Expo SecureStore adapter on native platforms, with AsyncStorage as the web fallback.

## Folder structure

```txt
app/                  Expo Router routes, layouts, and auth/protected route groups
src/components/       Shared reusable UI and form components
src/config/           App configuration such as env and query client setup
src/constants/        Design tokens and stable constants
src/features/         Feature modules introduced phase-by-phase, including auth
src/hooks/            Reusable cross-feature hooks
src/navigation/       Route constants and navigation helpers
src/providers/        App-level provider composition
src/services/         Supabase and API/service boundaries
src/store/            Lightweight global Zustand stores
src/theme/            Theme aggregation and exported theme types
src/types/            Global TypeScript declarations
src/utils/            Small shared utilities
```

## Getting started

```bash
npm install
cp .env.example .env
npm run start
```

Fill in `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` before using authentication against a live Supabase project.
