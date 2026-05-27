# GymBro

A modern gym and fitness mobile app built with React Native, Expo, and Supabase.

## Tech Stack

- **React Native** with **Expo** (SDK 56)
- **TypeScript**
- **Expo Router** — file-based navigation
- **NativeWind** — Tailwind CSS styling
- **Zustand** — client state management
- **React Query** — server state and caching
- **Supabase** — authentication and PostgreSQL database
- **Lucide React Native** — icons

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm start
```

Add your Supabase credentials to `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## Database Setup

Run the SQL migrations in your Supabase project (SQL Editor or Supabase CLI):

```
supabase/migrations/001_initial_schema.sql   # Tables, indexes, triggers
supabase/migrations/002_rls_policies.sql     # Row Level Security
supabase/migrations/003_seed_data.sql        # Sample muscle groups, exercises, programs
```

Using Supabase CLI:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Or paste each migration file into **Supabase Dashboard → SQL Editor** in order.

### Schema overview

| Table | Purpose |
|-------|---------|
| `users` | Public profile extending `auth.users` |
| `muscle_groups` | Chest, Back, Legs, etc. |
| `exercises` | Individual exercises linked to muscle groups |
| `workout_programs` | Structured training plans |
| `workout_days` | Days within a program |
| `workout_exercises` | Exercises assigned to a day |
| `workout_logs` | Completed/in-progress workout sessions |
| `workout_log_sets` | Individual sets logged per session |
| `favorites` | User-saved exercises |
| `user_progress` | Personal records and tracked metrics |

## Project Structure

```
app/                 # Expo Router screens and navigation
  (tabs)/            # Main tab navigation (protected)
  (auth)/            # Authentication screens
components/
  ui/                # Reusable UI primitives
  auth/              # Auth-specific UI components
  providers/         # App-level providers
constants/           # Config, routes, theme tokens
hooks/               # Custom React hooks
lib/                 # Utilities, validation, env helpers
services/            # API clients (Supabase, auth service)
stores/              # Zustand stores
supabase/migrations/ # PostgreSQL schema and seed data
types/               # Shared TypeScript types
```

## Development Phases

| Phase | Status |
|-------|--------|
| 1 — Project Foundation | ✅ Complete |
| 2 — Authentication | ✅ Complete |
| 3 — Database Design | ✅ Complete |
| 4 — Main UI Screens | Pending |
| 5 — Workout Tracker | Pending |
| 6 — Progress Tracking | Pending |
| 7 — Polish & Optimization | Pending |

## Authentication

- Email/password sign in and registration via Supabase
- Forgot password flow with email reset link
- Session persistence with SecureStore (native) / localStorage (web)
- Protected tab routes redirect unauthenticated users to login
- Auto-creates `public.users` profile on signup via database trigger

## License

See [LICENSE](./LICENSE).
