# @aja-app/scraper

CLI tool that scrapes job listings from remote job boards and inserts them into the `app.role` table in Supabase.

## Sources

- **Remote OK** — JSON API, filtered by tags (software, react, typescript, etc.)
- **We Work Remotely** — RSS feed, filtered by title keywords
- **Himalayas** — Paginated JSON API (up to 200 jobs per run)
- **Jobicy** — JSON API, queried across multiple tags with dedup
- **Google Jobs** — Browser-automated scraping via Patchright

Each source runs independently via `Promise.allSettled` — if one fails, the others still complete.

## Setup

```bash
cp .env.example .env
# Fill in your Supabase credentials
```

## Usage

```bash
pnpm scrape                    # all sources
pnpm scrape:himalayas          # single source
pnpm scrape:remoteok
pnpm scrape:weworkremotely
pnpm scrape:jobicy
pnpm scrape:google-jobs
```

## Deduplication

Roles are deduplicated by URL. Before inserting, the scraper fetches all existing URLs from `app.role` and skips any matches. This means running the scraper multiple times is safe — it only inserts new listings.
