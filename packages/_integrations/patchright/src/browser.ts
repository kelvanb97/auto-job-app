import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { chromium, type BrowserContext } from "patchright"

/**
 * Walk up from `process.cwd()` looking for `pnpm-workspace.yaml`. Throws if
 * the file isn't found before reaching the filesystem root.
 */
function findWorkspaceRoot(): string {
	let dir = process.cwd()
	while (true) {
		if (existsSync(resolve(dir, "pnpm-workspace.yaml"))) return dir
		const parent = dirname(dir)
		if (parent === dir) {
			throw new Error(
				`Could not find pnpm-workspace.yaml walking up from ${process.cwd()}`,
			)
		}
		dir = parent
	}
}

const USER_DATA_DIR = resolve(findWorkspaceRoot(), "data", "chrome-profile")

export type BrowserOptions = {
	headless?: boolean
}

export async function createBrowserContext(
	options: BrowserOptions = {},
): Promise<BrowserContext> {
	const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
		channel: "chrome",
		headless: options.headless ?? false,
		locale: "en-US",
		timezoneId: "America/Los_Angeles",
		viewport: { width: 1280, height: 900 },
	})
	return context
}

export async function closeBrowserContext(
	context: BrowserContext,
): Promise<void> {
	await context.close()
}
