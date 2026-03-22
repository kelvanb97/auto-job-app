import { SCRAPER_CONFIG } from "@aja-config/user/scraper"
import type { ScrapedRole } from "#types"

const RELEVANT_TITLE_RE = new RegExp(
	SCRAPER_CONFIG.relevantKeywords.join("|"),
	"i",
)

const BLOCKED_TITLE_RE = new RegExp(
	SCRAPER_CONFIG.blockedKeywords
		.map((kw) => `\\b${kw.replace(/\s+/g, ".?")}\\b`)
		.join("|"),
	"i",
)

export function filterRoles(roles: ScrapedRole[]): {
	filtered: ScrapedRole[]
	removedCount: number
} {
	const filtered = roles.filter(
		(r) =>
			RELEVANT_TITLE_RE.test(r.title) && !BLOCKED_TITLE_RE.test(r.title),
	)
	return { filtered, removedCount: roles.length - filtered.length }
}
