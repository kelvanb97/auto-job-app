import { runScraper } from "@aja-app/scraper/scrape"
import type { TScrapeProgressEvent } from "@aja-app/scraper/types"
import type { TSourceName } from "@aja-config/user/scraper"

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const sourcesParam = searchParams.get("sources")
	const sources = sourcesParam
		? (sourcesParam.split(",") as TSourceName[])
		: undefined

	const encoder = new TextEncoder()

	const stream = new ReadableStream({
		async start(controller) {
			let lastActivity = "Starting scrape..."

			const send = (event: TScrapeProgressEvent) => {
				// Track state for heartbeats
				if (event.type === "source:status") {
					lastActivity = `[${event.source}] ${event.status}`
				} else if (event.type === "source:start") {
					lastActivity = `Starting ${event.source}...`
				}

				controller.enqueue(
					encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
				)
			}

			const heartbeat = setInterval(() => {
				send({
					type: "heartbeat",
					timestamp: new Date().toISOString(),
					lastActivity,
				})
			}, 5000)

			try {
				const options = {
					sources: sources || undefined,
					signal: request.signal,
					onProgress: send,
				}
				await runScraper(options)
			} catch (err) {
				if (!request.signal.aborted) {
					const message =
						err instanceof Error ? err.message : String(err)
					controller.enqueue(
						encoder.encode(
							`data: ${JSON.stringify({ type: "source:error", source: "api", error: message })}\n\n`,
						),
					)
				}
			} finally {
				clearInterval(heartbeat)
				controller.close()
			}
		},
	})

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	})
}
