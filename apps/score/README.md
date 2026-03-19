# Score

Scores unscored job roles against a hardcoded candidate profile using Claude, writing results back to Supabase. Runs as a standalone Node script — no server, no build step.

---

## Setup

Copy `.env.example` to `.env` and fill in:

| Variable | Description | Default |
|---|---|---|
| `SUPABASE_URL` | Supabase instance URL | `http://127.0.0.1:54321` (local) |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | — |
| `SUPABASE_SECRET_KEY` | Supabase service role key | — |
| `ANTHROPIC_API_KEY` | Anthropic API key | — |
| `SCORE_MODEL` | Claude model ID to use | Haiku |
| `SCORE_RATE_LIMIT_MS` | Delay between API calls (ms) | `500` |

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
