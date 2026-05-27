# GymBro

GymBro is a modern Expo/React Native fitness app built feature-by-feature with TypeScript,
Supabase, Zustand, Expo Router, React Query, NativeWind, and Lucide icons.

## Phase 1 foundation

This phase establishes the project shell only. Screens are intentionally lightweight placeholders
so future phases can add authentication, database-backed data, workout tracking, and progress
features without rewriting the app structure.

## Folder structure

```txt
app/                         Expo Router route files and layout boundaries
  _layout.tsx                Root providers and stack shell
  (tabs)/                    Main mobile tab navigation
src/
  app/                       App-level providers and navigation metadata
  features/                  Feature slices grouped by business area
  services/                  API, Supabase, and data-fetching infrastructure
  shared/                    Reusable UI primitives, theme tokens, config, and utilities
  stores/                    Focused Zustand stores
  types/                     Shared TypeScript contracts
```

## Scripts

- `npm run start` - start Expo
- `npm run typecheck` - run TypeScript validation
- `npm run lint` - run Expo linting

## Environment

Copy `.env.example` to `.env` and provide Supabase values before enabling API-backed features.
