import type { ScrapedRole } from "#types"
import Parser from "rss-parser"

function extractCompany(title: string): string | null {
	const colonIndex = title.indexOf(":")
	if (colonIndex === -1) return null
	return title.slice(0, colonIndex).trim()
}

export async function scrape(): Promise<ScrapedRole[]> {
	const parser = new Parser()
	const feed = await parser.parseURL(
		"https://weworkremotely.com/categories/remote-programming-jobs.rss",
	)

	return feed.items.map((item) => ({
		title: item.title ?? "Untitled",
		url: item.link ?? null,
		company: item.title ? extractCompany(item.title) : null,
		description: item.contentSnippet ?? null,
		source: "weworkremotely",
		location_type: "remote",
		location: null,
		salary_min: null,
		salary_max: null,
		posted_at: item.pubDate ?? null,
	}))
}
