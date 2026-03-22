import { runScraper as run, type TScrapeSummary } from "@aja-app/scraper/scrape"
import type { TSourceName } from "@aja-config/user/scraper"

export type { TScrapeSummary }

export async function runScraper(only?: string): Promise<TScrapeSummary> {
	return only ? run({ sources: [only as TSourceName] }) : run({})
}
