import { resolve } from "node:path"
import type { TSourceName } from "@rja-api/settings/schema/scraper-config-schema"
import { initDb } from "@rja-core/drizzle"
import { runScraper, type TScrapeSummary } from "#scrape"

// Set cwd to apps/web/ so the database resolves correctly
process.chdir(resolve(import.meta.dirname, "../../../../apps/web"))

// Load env from root .env
process.loadEnvFile(resolve(import.meta.dirname, "../../../../.env"))

const VALID_SOURCES: TSourceName[] = ["linkedin"]

function printUsage() {
	console.log("Usage: pnpm --filter @rja-app/scraper run scrape <source>")
	console.log("")
	console.log("Sources:")
	for (const source of VALID_SOURCES) {
		console.log(`  ${source}`)
	}
	console.log("")
	console.log("Run all enabled sources:")
	console.log("  pnpm --filter @rja-app/scraper run scrape --all")
}

async function main() {
	const arg = process.argv[2]

	if (!arg || arg === "--help" || arg === "-h") {
		printUsage()
		process.exit(0)
	}

	initDb()

	let sources: TSourceName[] | undefined

	if (arg === "--all") {
		sources = undefined // runScraper defaults to all enabled sources
	} else {
		if (!VALID_SOURCES.includes(arg as TSourceName)) {
			console.error(`Unknown source: ${arg}`)
			printUsage()
			process.exit(1)
		}
		sources = [arg as TSourceName]
	}

	let summary: TScrapeSummary
	try {
		summary = await runScraper(sources ? { sources } : {})
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err)
		console.error(`Scraper failed: ${message}`)
		process.exit(1)
	}

	console.log("")
	console.log(JSON.stringify(summary, null, "\t"))
	process.exit(0)
}

main()
