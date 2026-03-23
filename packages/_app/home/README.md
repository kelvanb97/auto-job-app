# @aja-app/home

Dashboard screens and server actions for the web app, with Zustand state management.

## Exports

- `./home-screen` — `HomeScreen` dashboard page
- `./roles-screen` — `RolesScreen` job roles list with filtering/sorting
- `./people-screen` — `PeopleScreen` contact management
- `./follow-ups-screen` — `FollowUpsScreen` interaction tracking
- `./create-screen` — `CreateScreen` manual role creation
- `./operations-screen` — `OperationsScreen` scraper/scorer controls

## Dependencies

- `@aja-api/role`, `@aja-api/company`, `@aja-api/score`, `@aja-api/person`, `@aja-api/interaction`, `@aja-api/role-person`, `@aja-api/application`, `@aja-api/resume`, `@aja-api/cover-letter`, `@aja-api/storage` — entity CRUD
- `@aja-config/user` — user profile configuration
- `@aja-core/next-safe-action` — server action client
- `@aja-core/dates` — date formatting
- `@aja-design/ui` — UI components (peer)
- `zustand` (via internal stores)
