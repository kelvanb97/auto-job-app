import { AuthRequiredError } from "@rja-app/scraper/errors"
import { runScraper } from "@rja-app/scraper/scrape"

export async function GET(request: Request) {
	try {
		const summary = await runScraper({ signal: request.signal })
		return Response.json({ data: summary })
	} catch (err) {
		if (request.signal.aborted) {
			return new Response(null, { status: 499 })
		}
		if (err instanceof AuthRequiredError) {
			return Response.json(
				{ error: "auth_required", needsAuth: err.needsAuth },
				{ status: 401 },
			)
		}
		const message = err instanceof Error ? err.message : String(err)
		return Response.json({ error: message }, { status: 500 })
	}
}
