# GymBro (Expo + TypeScript)

GymBro is a modern fitness mobile app foundation built with clean, modular architecture for scalable feature-by-feature delivery.

## Tech Stack

- React Native with Expo
- TypeScript
- Expo Router
- NativeWind (Tailwind)
- Zustand
- React Query
- Supabase (PostgreSQL backend)
- Lucide React Native

## Project Structure

```txt
app/
  _layout.tsx                 # Root navigation + providers
  (tabs)/
    _layout.tsx               # Bottom tab navigator
    index.tsx                 # Home (placeholder)
    programs.tsx              # Programs (placeholder)
    exercises.tsx             # Exercise explorer (placeholder)
    tracker.tsx               # Workout tracker (placeholder)
    profile.tsx               # Profile (placeholder)

src/
  app/providers/
    app-providers.tsx         # Global providers (React Query + SafeArea)

  components/
    navigation/tab-icon.tsx   # Reusable tab icon adapter
    ui/
      screen.tsx              # Reusable safe screen wrapper
      section-card.tsx        # Reusable rounded card component

  config/
    env.ts                    # Environment variable access
    query-client.ts           # React Query client setup

  constants/
    query-keys.ts             # Central query key registry
    theme.ts                  # App color + spacing tokens

  features/
    programs/hooks/
      use-workout-programs.ts # Feature-level query hook
    exercises/hooks/
      use-exercises.ts        # Feature-level query hook

  services/
    supabase/client.ts        # Supabase client singleton
    programs/programs.service.ts
    exercises/exercises.service.ts

  store/
    auth.store.ts             # Persistent auth state scaffold
    workout-session.store.ts  # Workout session scaffold

  types/
    domain.ts                 # Core domain model types

  utils/
    cn.ts                     # Classname merge helper

.env.example                 # Required env keys
global.css                   # Tailwind directives
tailwind.config.js           # Tailwind + dark theme tokens
babel.config.js              # Expo + NativeWind + Router
metro.config.js              # NativeWind metro integration
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

This repository currently includes **Phase 1 foundation only**. Feature implementation (Auth, DB schema, main data UI, tracker, progress) will be built incrementally in later phases.
