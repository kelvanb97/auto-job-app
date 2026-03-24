# Score

Scores unscored job roles against a hardcoded candidate profile using Claude, writing results back to Supabase. Runs as a standalone Node script — no server, no build step.

---

## Setup

Environment variables are loaded from the root `.env` file. See the root `.env.example` for required and optional variables.

| Variable | Description | Default |
|---|---|---|
| `SCORE_MODEL` | Claude model ID to use | `claude-haiku-4-5-20251001` |
| `SCORE_RATE_LIMIT_MS` | Delay between API calls (ms) | `500` |
| `SCORE_BATCH_SIZE` | Number of roles to score per batch | `5` |

---

## Scripts

| Script | Command | Purpose |
|---|---|---|
| Score | `pnpm score` | Fetch all unscored roles from DB and score them |

---

## Key files

| Path | Purpose |
|---|---|
| `src/index.ts` | Entry point |
| `src/score.ts` | Main scoring loop |
