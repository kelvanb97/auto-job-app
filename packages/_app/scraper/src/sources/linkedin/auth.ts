import type { BrowserContext } from "@rja-integrations/patchright/page"

// LinkedIn sets `li_at` on a successful login. Cookie-only check is fast
// (no navigation) and good enough — if the cookie is stale, the scrape
// itself will fail and the user can re-run /scrape to recover.
export async function isAuthenticated(
	context: BrowserContext,
): Promise<boolean> {
	const cookies = await context.cookies("https://www.linkedin.com")
	return cookies.some((c) => c.name === "li_at" && c.value.length > 0)
}
