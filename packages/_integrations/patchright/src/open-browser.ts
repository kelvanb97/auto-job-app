import { closeBrowserContext, createBrowserContext } from "./browser"

async function main() {
	const context = await createBrowserContext()
	const page = await context.newPage()
	await page.goto("https://www.google.com")

	await new Promise<void>((resolve) => {
		context.on("close", () => resolve())
	})

	await closeBrowserContext(context).catch(() => {})
	console.log("Browser closed.")
}

main().catch(console.error)
