import { scoreRoleById } from "@rja-api/score/api/score-role-by-id"
import { getScraperConfig } from "@rja-api/settings/api/get-scraper-config"
import type { TSourceName } from "@rja-api/settings/schema/scraper-config-schema"
import {
	closeBrowserContext,
	createBrowserContext,
} from "@rja-integrations/patchright/browser"
import { AuthRequiredError, type TNeedsAuthEntry } from "#errors"
import { filterRoles } from "#lib/filter"
import { insertRole } from "#lib/insert"
import * as linkedin from "#sources/linkedin/index"
import { ALL_SOURCES } from "#sources/registry"
import type { ScrapedRole, TSourceScrapeOptions } from "#types"

export type TScrapeSummary = {
	total: {
		found: number
		filtered: number
		inserted: number
		skipped: number
		scored: number
		scoreErrors: number
		errors: number
	}
	sources: Record<
		string,
		{
			found: number
			filtered: number
			inserted: number
			skipped: number
			scored: number
			scoreErrors: number
			error?: string
		}
	>
}

export type TScrapeOptions = {
	signal?: AbortSignal
}

export async function runScraper(
	options: TScrapeOptions = {},
): Promise<TScrapeSummary> {
	const configResult = getScraperConfig()
	if (!configResult.ok) {
		throw new Error(configResult.error.message)
	}
	if (!configResult.data) {
		throw new Error(
			"Scraper config not found. Please configure scraper settings first.",
		)
	}

	const config = configResult.data
	const sources = config.enabledSources as TSourceName[]
	if (sources.length === 0) {
		throw new Error(
			"No sources are enabled. Enable one at /settings before running /scrape.",
		)
	}
	const { signal } = options

	const filterConfig = {
		relevantKeywords: config.relevantKeywords,
		blockedKeywords: config.blockedKeywords,
		blockedCompanies: config.blockedCompanies,
	}

	const companyCache = new Map<string, number>()

	const summary: TScrapeSummary = {
		total: {
			found: 0,
			filtered: 0,
			inserted: 0,
			skipped: 0,
			scored: 0,
			scoreErrors: 0,
			errors: 0,
		},
		sources: {},
	}

	const context = await createBrowserContext()

	try {
		// Pre-check auth for every requested source. If any are missing
		// auth, throw AuthRequiredError so the API can return 401 with
		// a needsAuth payload — the skill will run the login CLI and
		// re-call this endpoint.
		const needsAuth: TNeedsAuthEntry[] = []
		for (const name of sources) {
			const sourceModule = ALL_SOURCES[name]
			if (!sourceModule) continue
			if (!sourceModule.isAuthenticated) continue
			const ok = await sourceModule.isAuthenticated(context)
			if (!ok) {
				needsAuth.push({
					name,
					displayName: sourceModule.DISPLAY_NAME,
					homepageUrl: sourceModule.HOMEPAGE_URL,
				})
			}
		}
		if (needsAuth.length > 0) {
			throw new AuthRequiredError(needsAuth)
		}

		for (const name of sources) {
			if (signal?.aborted) break

			if (!ALL_SOURCES[name]) {
				console.warn(`Unknown source "${name}", skipping`)
				continue
			}

			console.log(`[${name}] Starting...`)

			try {
				const sourceSummary = {
					found: 0,
					filtered: 0,
					inserted: 0,
					skipped: 0,
					scored: 0,
					scoreErrors: 0,
				}

				const onRole = async (role: ScrapedRole) => {
					sourceSummary.found++

					// Filter
					const { filtered, removedCount } = filterRoles(
						[role],
						filterConfig,
					)
					if (removedCount > 0) {
						sourceSummary.filtered++
						return
					}

					// Insert immediately
					const result = insertRole(filtered[0]!, companyCache)
					if (result.status !== "inserted") {
						sourceSummary.skipped++
						return
					}

					sourceSummary.inserted++

					// Score inline. Failures are logged but never break the
					// scrape — the role row stays in the DB and can be
					// re-scored manually from the UI.
					const inserted = result.role
					const scoreResult = await scoreRoleById(inserted.id)
					if (scoreResult.ok) {
						sourceSummary.scored++
						console.log(
							`[score] "${inserted.title}" → ${scoreResult.data.score}`,
						)
					} else {
						sourceSummary.scoreErrors++
						console.warn(
							`[score] "${inserted.title}": ${scoreResult.error.message}`,
						)
					}
				}

				const scrapeOptions: TSourceScrapeOptions = { onRole, signal }

				await linkedin.scrape(
					context,
					{
						urls: config.linkedinUrls,
						maxPages: config.linkedinMaxPages,
						maxPerPage: config.linkedinMaxPerPage,
					},
					scrapeOptions,
				)

				summary.sources[name] = sourceSummary
				summary.total.found += sourceSummary.found
				summary.total.filtered += sourceSummary.filtered
				summary.total.inserted += sourceSummary.inserted
				summary.total.skipped += sourceSummary.skipped
				summary.total.scored += sourceSummary.scored
				summary.total.scoreErrors += sourceSummary.scoreErrors

				console.log(
					`[${name}] found=${sourceSummary.found} filtered=${sourceSummary.filtered} inserted=${sourceSummary.inserted} skipped=${sourceSummary.skipped} scored=${sourceSummary.scored} scoreErrors=${sourceSummary.scoreErrors}`,
				)
			} catch (err) {
				const rawMessage =
					err instanceof Error ? err.message : String(err)
				const isBrowserClosed =
					/has been closed|Target closed|Browser closed|Page closed/i.test(
						rawMessage,
					)
				const error = isBrowserClosed
					? "The scraper browser window was closed before the scrape finished. Please leave the browser window open until the scrape is complete."
					: rawMessage
				summary.sources[name] = {
					found: 0,
					filtered: 0,
					inserted: 0,
					skipped: 0,
					scored: 0,
					scoreErrors: 0,
					error,
				}
				summary.total.errors += 1
				console.error(`[${name}] error: ${rawMessage}`)
			}
		}
	} finally {
		await closeBrowserContext(context).catch(() => {})
	}

	console.log(
		`[total] found=${summary.total.found} filtered=${summary.total.filtered} inserted=${summary.total.inserted} skipped=${summary.total.skipped} scored=${summary.total.scored} scoreErrors=${summary.total.scoreErrors} errors=${summary.total.errors}`,
	)

	return summary
}
