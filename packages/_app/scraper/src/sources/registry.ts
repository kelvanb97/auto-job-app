import type { TSourceName } from "@rja-api/settings/schema/scraper-config-schema"
import type { BrowserContext } from "@rja-integrations/patchright/page"
import * as linkedin from "./linkedin/index"

// Capability surface that the orchestrator queries generically.
// Per-source `scrape` calls go through hardcoded dispatch in `runScraper`
// because each source has its own config shape.
type SourceModule = {
	DISPLAY_NAME: string
	HOMEPAGE_URL: string
	isAuthenticated?: (context: BrowserContext) => Promise<boolean>
}

export const ALL_SOURCES: Record<TSourceName, SourceModule> = {
	linkedin,
}
