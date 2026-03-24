# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Verification

After making changes, run from the project root:

```bash
pnpm format
pnpm depcheck
pnpm check-types
pnpm lint
pnpm test
```

To run checks for a single package:

```bash
pnpm --filter @aja-api/role check-types
pnpm --filter @aja-api/role lint
```

## Running Apps

```bash
pnpm dev                                          # all apps (Turbo)
pnpm --filter @aja-app/scraper scrape             # one-shot scrape (all sources)
pnpm --filter @aja-app/scraper scrape:himalayas   # single source
pnpm --filter @aja-app/score score                # score unscored roles
```

All apps load env from the root `.env` file. See `.env.example` for available variables. Scraper and score use Node's `--env-file=../../.env` flag; web loads it via `process.loadEnvFile()` in `next.config.ts`.

## Architecture

Turborepo monorepo with pnpm workspaces. Six package layers:

| Layer                     | Scope                 | Purpose                                                 |
| ------------------------- | --------------------- | ------------------------------------------------------- |
| `apps/`                   | —                     | Deployable applications (web, scraper, score, supabase) |
| `packages/_api/`          | `@aja-api/*`          | Entity CRUD operations against Supabase                 |
| `packages/_app/`          | `@aja-app/*`          | Feature modules (React components, server actions)      |
| `packages/_config/`       | `@aja-config/*`       | User-specific configuration (profile, scoring, scraper) |
| `packages/_core/`         | `@aja-core/*`         | Shared utilities and config                             |
| `packages/_design/`       | `@aja-design/*`       | Component library (Radix UI + Tailwind)                 |
| `packages/_integrations/` | `@aja-integrations/*` | Third-party SDK wrappers (Anthropic, Patchright)        |

### Dependency hierarchy

```
apps → _app → _api → _core
                 ↘    ↗
               _design

_api and apps → _integrations
apps (scraper, score) → _config
```

API and core packages are **dependencies** (not peerDependencies) in app packages.

### Package exports

API packages export via subpath patterns in package.json:

```json
"exports": {
  "./api/*": "./src/api/*.ts",
  "./schema/*": "./src/schema/*.ts"
}
```

Import like: `import { createRole } from "@aja-api/role/api/create-role"`

Internal imports within a package use `#` aliases defined in the `imports` field of each package's `package.json`:

```json
"imports": {
  "#*": ["./src/*", "./src/*.ts", "./src/*.tsx"]
}
```

### Apps

- **web** — Next.js 16 (App Router, Turbopack). Routes delegate to screens from `@aja-app/home`.
- **scraper** — Node.js process. Cron mode (default) or one-shot (`--now`). Sources: Remote OK, We Work Remotely, Himalayas, Jobicy, Google Jobs. HTTP endpoint on configurable port.
- **score** — Node.js process. Fetches unscored roles, scores each via Anthropic, rate-limited.
- **supabase** — Supabase CLI project. Migrations, local dev config.

## Key Patterns

### TResult

All API functions return `Promise<TResult<T>>`. Defined in `@aja-core/result`:

```typescript
type TResult<T, E = Error> =
    | { ok: true; data: T }
    | { ok: false; error: E }
```

Use helpers: `ok(data)`, `err(error)`, `errFrom("message")`

### Marshallers

Each API entity has marshallers in `src/schema/{entity}-marshallers.ts` that convert between camelCase (API types) and snake_case (database columns):

- `unmarshalX(row)` — database row → API type
- `marshalCreateX(input)` — create input → database insert
- `marshalUpdateX(input)` — update input → database update

### Server Actions

Located in `packages/_app/*/src/next/actions/`. Pattern:

```typescript
"use server"
export const doThing = actionClient
    .inputSchema(zodSchema)
    .action(async ({ parsedInput }) => {
        const result = await apiFunction(parsedInput)
        if (!result.ok) throw new SafeForClientError(result.error.message)
        return result.data
    })
```

App packages should **not** export server actions — they are consumed internally by the app's own components.

### API Layer

Each entity package follows this structure:

```
src/
  api/        # CRUD functions returning TResult
  schema/     # Zod schemas, TypeScript types, marshallers
```

API functions use `supabaseAdminClient<Database>()` from `@aja-core/supabase`.

## Supabase

- All application tables live in the `app` schema (not `public`)
- Local dev URLs: `http://127.0.0.1:54321` (scraper/score), `localhost:3000` (web)
- Env vars: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`
- Migrations are in `apps/supabase/migrations/`
- Local Supabase: `pnpm --filter supabase start` / `stop`

## Documentation

When making changes, update any README that is affected by the change. This includes:

- The root `README.md` if the change affects architecture, features, roadmap, or repository structure
- A package's `README.md` if the change modifies that package's API, purpose, or usage

Keep READMEs factual and concise. Do not add speculative content or document things that haven't been built yet.

## Code Style

- Tabs for indentation (not spaces)
- No semicolons, double quotes, trailing commas (`"semi": false, "singleQuote": false`)
- Prettier with `@ianvs/prettier-plugin-sort-imports` handles formatting
- Conventional Commits enforced by commitlint (e.g. `feat:`, `fix:`, `refactor:`)
- Pre-commit hook runs Prettier via lint-staged
- Syncpack enforces `workspace:*` for local deps and exact versions for external deps
