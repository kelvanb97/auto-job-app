import { SCRAPER_CONFIG, type TSourceName } from "@aja-config/user/scraper"
import { filterRoles } from "#lib/filter"
import { insertRoles } from "#lib/insert"
import * as googleJobs from "#sources/google-jobs/index"
import * as himalayas from "#sources/himalayas"
import * as jobicy from "#sources/jobicy"
import * as remoteok from "#sources/remoteok"
import * as weworkremotely from "#sources/weworkremotely"
import type { ScrapedRole, TScrapeProgressCallback } from "#types"

type SourceModule = {
	scrape: () => Promise<ScrapedRole[]>
}

const ALL_SOURCES: Record<TSourceName, SourceModule> = {
	remoteok,
	weworkremotely,
	himalayas,
	jobicy,
	"google-jobs": googleJobs,
}

export type TScrapeSummary = {
	total: {
		found: number
		filtered: number
		inserted: number
		skipped: number
		errors: number
	}
	sources: Record<
		string,
		{
			found: number
			filtered: number
			inserted: number
			skipped: number
			error?: string
		}
	>
}

export type TScrapeOptions = {
	sources?: TSourceName[]
	signal?: AbortSignal
	onProgress?: TScrapeProgressCallback
}

export async function runScraper(
	options: TScrapeOptions = {},
): Promise<TScrapeSummary> {
	const {
		sources = SCRAPER_CONFIG.enabledSources,
		signal,
		onProgress,
	} = options

	const summary: TScrapeSummary = {
		total: { found: 0, filtered: 0, inserted: 0, skipped: 0, errors: 0 },
		sources: {},
	}

	for (const name of sources) {
		if (signal?.aborted) break

		const sourceModule = ALL_SOURCES[name]
		if (!sourceModule) {
			console.warn(`Unknown source "${name}", skipping`)
			continue
		}

		onProgress?.({ type: "source:start", source: name })

		try {
			const allRoles = await sourceModule.scrape()
			onProgress?.({
				type: "source:found",
				source: name,
				count: allRoles.length,
			})

			const { filtered: roles, removedCount } = filterRoles(allRoles)
			const { inserted, skipped } = await insertRoles(roles, signal)

			summary.sources[name] = {
				found: allRoles.length,
				filtered: removedCount,
				inserted,
				skipped,
			}
			summary.total.found += allRoles.length
			summary.total.filtered += removedCount
			summary.total.inserted += inserted
			summary.total.skipped += skipped

			onProgress?.({
				type: "source:inserted",
				source: name,
				inserted,
				skipped,
			})

			console.log(
				`[${name}] found=${allRoles.length} filtered=${removedCount} inserted=${inserted} skipped=${skipped}`,
			)
		} catch (err) {
			const error = err instanceof Error ? err.message : String(err)
			summary.sources[name] = {
				found: 0,
				filtered: 0,
				inserted: 0,
				skipped: 0,
				error,
			}
			summary.total.errors += 1
			onProgress?.({ type: "source:error", source: name, error })
			console.error(`[${name}] error: ${error}`)
		}

		onProgress?.({ type: "source:done", source: name })
	}

	console.log(
		`[total] found=${summary.total.found} filtered=${summary.total.filtered} inserted=${summary.total.inserted} skipped=${summary.total.skipped} errors=${summary.total.errors}`,
	)

	onProgress?.({ type: "done" })

	return summary
}
