import type { TSourceName } from "@rja-api/settings/schema/scraper-config-schema"
import {
	closeBrowserContext,
	createBrowserContext,
} from "@rja-integrations/patchright/browser"
import { ALL_SOURCES } from "#sources/registry"

const MAX_WAIT_MS = 10 * 60 * 1000
const POLL_INTERVAL_MS = 2000

async function main() {
	const name = process.argv[2] as TSourceName | undefined
	if (!name) {
		console.error("Usage: login <source-name>")
		process.exit(1)
	}
	const mod = ALL_SOURCES[name]
	if (!mod) {
		console.error(`Unknown source: ${name}`)
		process.exit(1)
	}

	const context = await createBrowserContext()
	try {
		const page = await context.newPage()
		await page.goto(mod.HOMEPAGE_URL)
		console.log(
			`Opened ${mod.DISPLAY_NAME}. Log in — the window will close automatically once you're signed in.`,
		)

		const start = Date.now()
		await new Promise<void>((resolve) => {
			let done = false
			let interval: NodeJS.Timeout | null = null
			const finish = () => {
				if (done) return
				done = true
				if (interval) clearInterval(interval)
				resolve()
			}
			context.on("close", finish)
			interval = setInterval(async () => {
				if (done) return
				try {
					if (context.pages().length === 0) {
						finish()
						return
					}
					if (
						mod.isAuthenticated &&
						(await mod.isAuthenticated(context))
					) {
						console.log("Login detected.")
						finish()
						return
					}
					if (Date.now() - start > MAX_WAIT_MS) {
						console.error("Timed out waiting for login.")
						finish()
						return
					}
				} catch {
					finish()
				}
			}, POLL_INTERVAL_MS)
		})
	} finally {
		await closeBrowserContext(context).catch(() => {})
	}
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
