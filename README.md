# Mobile Fitness App (FitForge)

Personalized workout generation by body type, goal, and equipment. **Flutter** app in `mobile/`.

## Run the app

```bash
cd mobile
flutter pub get
flutter run
```

## Seed data (Stage 2)

| File | Contents |
|------|----------|
| `data/seed/exercises.seed.json` | 59 exercises |
| `data/seed/split_templates.seed.json` | 27 session templates (PPL / Upper-Lower / Full Body × 3 body types) |
| `data/config/algorithm_config.json` | Volume, RPE, rest, progression constants |

Architecture: `docs/ARCHITECTURE.md`
