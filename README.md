# GymBro

> Modern dark-themed gym & fitness mobile app.
> Browse programs · Explore exercises · Track workouts · Monitor progress.

---

## Tech Stack

| Layer           | Tool                                  |
| --------------- | ------------------------------------- |
| Framework       | React Native + **Expo SDK 51**        |
| Language        | **TypeScript** (strict)               |
| Routing         | **Expo Router** (file-based, typed)   |
| Styling         | **NativeWind v4** (Tailwind for RN)   |
| Client state    | **Zustand**                           |
| Server state    | **TanStack React Query**              |
| Backend / Auth  | **Supabase** (PostgreSQL + Auth)      |
| Icons           | **lucide-react-native**               |

---

## Project Structure

```
app/                        Expo Router routes (routing only — no logic)
  _layout.tsx              Root providers + SessionGate
  index.tsx                Redirect to (auth) or (tabs) based on session
  (auth)/                  Public routes (login, register, forgot-password)
  (tabs)/                  Protected tabs (Phase 4 will add real tabs)

src/
  components/
    ui/                    Atomic primitives (Button, Text, TextField...)
    layout/                Layout primitives (Screen...)
  features/                Feature-sliced modules
    auth/                  ← Phase 2
      components/
      hooks/
      services/
      validators.ts
      index.ts             Public surface (import only from here)
  hooks/                   Cross-cutting hooks
  lib/                     Third-party clients (supabase, queryClient)
  services/                Cross-feature data services
  store/                   Zustand slices
  theme/                   Design tokens (colors, spacing, radii, typography)
  constants/               env, routes, app config
  types/                   Shared TS types
  utils/                   Pure helpers (cn, formatters...)
```

### Architectural rules

1. **`app/` holds routes only.** All logic lives in `src/`.
2. **Feature folders own their UI, hooks, services, and types.** Adding a feature = adding a folder.
3. **Zustand for client state · React Query for server state.** Never mix.
4. **Design tokens in `src/theme` are the single source of truth.** Tailwind config consumes the same files.
5. **No deep relative imports.** Use the `@/*` path alias.
6. **Outside code imports from a feature's `index.ts` only** — internals stay refactorable.

---

## Setup

```bash
# 1. Install deps
npm install

# 2. Configure environment
cp .env.example .env
# fill in your Supabase URL + anon key

# 3. Run
npm run start
```

---

## Roadmap

| Phase | Scope                                    | Status     |
| ----- | ---------------------------------------- | ---------- |
| 1     | Project foundation & architecture        | done       |
| 2     | Authentication (Supabase)                | done       |
| 3     | Database schema & seed                   | next       |
| 4     | Main UI screens                          | pending    |
| 5     | Workout tracker                          | pending    |
| 6     | Progress tracking                        | pending    |
| 7     | Polish & optimization                    | pending    |
