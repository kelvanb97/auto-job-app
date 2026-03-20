import type { Page } from "patchright"

export function randomWait(min: number, max: number): Promise<void> {
	const ms = Math.floor(Math.random() * (max - min + 1)) + min
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function humanType(
	page: Page,
	selector: string,
	text: string,
): Promise<void> {
	await page.click(selector)
	for (const char of text) {
		await page.keyboard.type(char)
		await randomWait(50, 150)
	}
}

export async function humanClick(page: Page, selector: string): Promise<void> {
	const element = page.locator(selector).first()
	await element.scrollIntoViewIfNeeded()
	await randomWait(200, 600)
	await element.click()
}

export async function humanScroll(page: Page, deltaY: number): Promise<void> {
	await page.mouse.wheel(0, deltaY)
	await randomWait(100, 300)
}

/**
 * Scrolls to the bottom of the page using repeated human-like scroll
 * actions. Useful for pages with infinite scroll / lazy-loaded content.
 */
export async function scrollToBottom(
	page: Page,
	options?: { scrollDelta?: number; waitMin?: number; waitMax?: number },
): Promise<void> {
	const delta = options?.scrollDelta ?? 800
	const waitMin = options?.waitMin ?? 1_500
	const waitMax = options?.waitMax ?? 3_000
	let retries = 0
	const MAX_RETRIES = 1

	while (true) {
		const prevHeight = await page.evaluate(() => document.body.scrollHeight)

		await humanScroll(page, delta)
		await randomWait(waitMin, waitMax)

		const atBottom = await page.evaluate(
			() =>
				window.scrollY + window.innerHeight >=
				document.body.scrollHeight - 5,
		)

		if (!atBottom) {
			// Not at the bottom yet — keep scrolling
			retries = 0
			continue
		}

		// At the bottom — check if new content loaded
		const newHeight = await page.evaluate(() => document.body.scrollHeight)

		if (newHeight > prevHeight) {
			// Page grew — new content loaded, keep scrolling
			retries = 0
			continue
		}

		// Height unchanged — might be slow-loading or truly done
		if (retries < MAX_RETRIES) {
			retries++
			await randomWait(3_000, 5_000)
			continue
		}

		break
	}
}
