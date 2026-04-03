---
name: scrape
description: >
  Scrape job listings from configured sources. Prompts the user to select
  which sources to scrape, then runs the scraper CLI for each. Use when
  user says "scrape", "scrape jobs", "run scraper", or "/scrape".
user-invocable: true
---

# Scrape Jobs

Scrape job listings from external sources and insert them into the database.

## Prerequisites

- The scraper config must be configured in Settings (keywords, blocked companies, etc.)

## Step 1: Ask which sources to scrape

Use AskUserQuestion to let the user pick sources:

- **Question:** "Which sources do you want to scrape?"
- **multiSelect:** true
- **Options:**
  - `google-jobs` — Google Jobs (browser-automated, uses configured titles)
  - `linkedin` — LinkedIn (browser-automated, uses configured URLs)
  - `himalayas` — Himalayas (API)
  - `jobicy` — Jobicy (RSS)
  - `remoteok` — Remote OK (API)
  - `weworkremotely` — We Work Remotely (RSS)

## Step 2: Run the scraper for each source

For each selected source, run the CLI command using the Bash tool:

```bash
pnpm --filter @rja-app/scraper run scrape <source-name>
```

Run sources **sequentially** (not in parallel) so the user can see progress naturally.

The scraper logs output directly to stdout — found/filtered/inserted/skipped counts per source, plus a JSON summary at the end.

## Step 3: Report results

After all sources complete, give the user a brief summary:
- Total roles found, inserted, filtered, and skipped across all sources
- Any errors encountered
