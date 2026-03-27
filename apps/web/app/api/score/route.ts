import { runBatchScore } from "@aja-app/score/batch-score"
import type { TScoreProgressEvent } from "@aja-app/score/types"

export async function GET(request: Request) {
	const encoder = new TextEncoder()

	const stream = new ReadableStream({
		async start(controller) {
			let lastActivity = "Initializing batch score..."

			const send = (event: TScoreProgressEvent) => {
				if (event.type === "score:progress") {
					lastActivity = `Scoring "${event.title}" (${event.current}/${event.total})`
				} else if (event.type === "score:start") {
					lastActivity = `Starting score of ${event.total} roles...`
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
				await runBatchScore({
					signal: request.signal,
					onProgress: send,
				})
			} catch (err) {
				if (!request.signal.aborted) {
					const message =
						err instanceof Error ? err.message : String(err)
					controller.enqueue(
						encoder.encode(
							`data: ${JSON.stringify({ type: "error", error: message })}\n\n`,
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
