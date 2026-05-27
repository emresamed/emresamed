# GymBro

A modern gym and fitness mobile app built with React Native, Expo, and Supabase.

## Tech Stack

- **React Native** with **Expo** (SDK 56)
- **TypeScript**
- **Expo Router** — file-based navigation
- **NativeWind** — Tailwind CSS styling
- **Zustand** — client state management
- **React Query** — server state and caching
- **Supabase** — authentication and database
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
hooks/               # Custom React hooks (useAuth, useAuthGuard)
lib/                 # Utilities, validation, env helpers
services/            # API clients (Supabase, auth service)
stores/              # Zustand stores
types/               # Shared TypeScript types
```

## Development Phases

| Phase | Status |
|-------|--------|
| 1 — Project Foundation | ✅ Complete |
| 2 — Authentication | ✅ Complete |
| 3 — Database Design | Pending |
| 4 — Main UI Screens | Pending |
| 5 — Workout Tracker | Pending |
| 6 — Progress Tracking | Pending |
| 7 — Polish & Optimization | Pending |

## Authentication

- Email/password sign in and registration via Supabase
- Forgot password flow with email reset link
- Session persistence with SecureStore (native) / localStorage (web)
- Protected tab routes redirect unauthenticated users to login
- Auth routes redirect authenticated users to the main app

## License

See [LICENSE](./LICENSE).
