# @rja-api/score

Score job roles against a candidate profile using an LLM. Combines database CRUD with AI-powered scoring.

## Exports

### `./api/*`

- `upsertScore(input)` — insert or update a score
- `deleteScore(id)` — delete by ID
- `getScoreByRole(roleId)` — fetch score for a role (returns `TScore | null`)
- `listScoresByRoles(roleIds)` — batch fetch scores
- `scoreRoleById(roleId)` — end-to-end: fetch role + company, build prompt, call the LLM, upsert result
- `scoreRoleData(role, company)` — score from pre-fetched data

All return `Promise<TResult<T>>`.

### `./schema/*`

- `TScore` — score entity type (roleId, score 0-100, positive[], negative[])
- `TUpsertScore` — input type for upserting
- `TScoreResponse` — structured AI response (score, isTitleFit, isSkillsAlign, etc.)
- Zod schemas and marshallers

### `./prompt/*`

- `buildScoringPrompt(role, company, profile, weights)` — generates `{ system, user }` strings for the LLM call

### `./lib/*`

- `scoreRole(system, user)` — resolves the LLM provider/model/API key from `@rja-api/settings`, calls `@rja-integrations/llm`, and parses the structured response

## Dependencies

- `@rja-integrations/llm` — provider-agnostic LLM dispatch
- `@rja-api/settings` — user LLM config (providers, models, keys) and scoring weights
