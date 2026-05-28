# AGENTS.md

## Cursor Cloud specific instructions

This is a TypeScript core library for a mobile fitness app ("mobile-fitness-core"). There is no web UI or server on this branch — it is a pure library.

### Key commands

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Build | `npm run build` |
| Typecheck | `npm run typecheck` |
| Test | `npm test` (runs typecheck) |
| Smoke test | `node -e "import('./dist/smoke.js').then(m => console.log(m.runSmokeDemo()))"` — expected output: `2` |

### Notes

- The `main` branch is empty (only README). All code lives on feature branches.
- Build output goes to `dist/` (gitignored).
- The project uses ESM (`"module": "NodeNext"`) — imports in source use `.js` extensions.
- TypeScript `^6.0.3` is the only dependency.
- Seed data for the workout generator is at `data/seeds/mobile_fitness_seed.json`.
