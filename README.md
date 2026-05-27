# GymBro (Expo + TypeScript)

GymBro is a modern fitness mobile app built with clean, modular architecture for scalable feature-by-feature delivery.

## Tech Stack

- React Native with Expo
- TypeScript
- Expo Router
- NativeWind (Tailwind)
- Zustand
- React Query
- Supabase (PostgreSQL backend)
- Lucide React Native

## Current Scope

- ✅ Phase 1: Project foundation
- ✅ Phase 2: Authentication system (login, register, forgot password, session persistence, protected routes)

## Project Structure

```txt
app/
  _layout.tsx                      # Root providers + auth route guard
  (auth)/
    _layout.tsx                    # Auth stack layout
    sign-in.tsx                    # Login screen
    sign-up.tsx                    # Register screen
    forgot-password.tsx            # Password reset screen
  (tabs)/
    _layout.tsx                    # Bottom tab navigator (protected)
    index.tsx
    programs.tsx
    exercises.tsx
    tracker.tsx
    profile.tsx

src/
  app/providers/
    app-providers.tsx              # Global providers (React Query + SafeArea)

  components/
    forms/
      form-input.tsx               # Reusable form input
      form-message.tsx             # Reusable inline status/error message
      primary-button.tsx           # Reusable action button with loading state
    navigation/
      tab-icon.tsx                 # Reusable tab icon adapter
    ui/
      screen.tsx                   # Reusable safe screen wrapper
      section-card.tsx             # Reusable rounded card component

  config/
    env.ts                         # Environment variable access
    query-client.ts                # React Query client setup

  constants/
    query-keys.ts                  # Central query key registry
    theme.ts                       # App color + spacing tokens

  features/
    auth/
      hooks/
        use-auth-state.ts          # Read auth status/user from store
        use-auth-session.ts        # Sync Supabase session -> Zustand
        use-auth-mutations.ts      # Sign-in/up/reset/sign-out mutations
      validation/
        auth-validation.ts         # Reusable auth form validation
    programs/hooks/
      use-workout-programs.ts
    exercises/hooks/
      use-exercises.ts

  services/
    supabase/client.ts             # Supabase client singleton + config guard
    auth/auth.service.ts           # Auth API layer
    programs/programs.service.ts
    exercises/exercises.service.ts

  store/
    auth.store.ts                  # Persistent auth state scaffold
    workout-session.store.ts       # Workout session scaffold

  types/
    auth.ts                        # Auth-specific types
    domain.ts                      # Core domain model types

  utils/
    cn.ts                          # Classname merge helper
```

## Environment

1. Copy `.env.example` to `.env`
2. Fill in:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Scripts

- `npm run start` - Start Expo
- `npm run dev` - Start Expo with cache clear
- `npm run typecheck` - TypeScript typecheck

## Notes

GymBro is intentionally developed in phases to keep architecture clean and maintainable as features expand.
