// ---------------------------------------------------------------------------
// Constants — positional indices into the 520084652 job entry array
// ---------------------------------------------------------------------------

const JOB_KEY = "520084652"

const IDX = {
	TITLE: 0,
	COMPANY: 1,
	LOCATION: 2,
	APPLY_OPTIONS: 3,
	POSTED_AT: 12,
	SALARY_TEXT: 14,
	DESCRIPTION: 19,
	EMPLOYMENT_TYPE: 23,
	PARSED_SECTIONS: 27,
	DOC_ID: 28,
} as const

// Apply option sub-indices
const APPLY = {
	URL: 0,
	DOMAIN: 1,
	SOURCE_NAME: 2,
	IS_CANONICAL: 5,
} as const

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GoogleJobResult = {
	title: string
	company: string | null
	location: string | null
	description: string | null
	applyUrl: string | null
	applicationUrl: string | null
	postedAt: string | null
	employmentType: string | null
	salaryText: string | null
	docId: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeGet(arr: unknown[], index: number): unknown {
	return index < arr.length ? arr[index] : null
}

function safeString(val: unknown): string | null {
	if (typeof val === "string" && val.length > 0) return val
	return null
}

function extractApplyUrls(applyOptions: unknown): {
	applyUrl: string | null
	applicationUrl: string | null
} {
	if (!Array.isArray(applyOptions) || applyOptions.length === 0) {
		return { applyUrl: null, applicationUrl: null }
	}

	let canonicalUrl: string | null = null
	let firstUrl: string | null = null

	for (const opt of applyOptions) {
		if (!Array.isArray(opt)) continue
		const url = typeof opt[APPLY.URL] === "string" ? opt[APPLY.URL] : null
		if (!url) continue

		if (!firstUrl) firstUrl = url

		// Entry with [5]=1 is the canonical/primary source
		if (opt[APPLY.IS_CANONICAL] === 1) {
			canonicalUrl = url
		}
	}

	// applicationUrl = canonical (direct company link), applyUrl = first available
	return {
		applyUrl: firstUrl,
		applicationUrl: canonicalUrl ?? firstUrl,
	}
}

// ---------------------------------------------------------------------------
// Embedded JSON extraction
// ---------------------------------------------------------------------------

export function extractJobEntries(text: string): GoogleJobResult[] {
	const jobs: GoogleJobResult[] = []

	// Find all JOB_KEY entries in the text. The data is embedded inside a
	// <script> tag as deeply nested arrays/objects. We locate each occurrence
	// of the key and extract the following array value.
	const keyPattern = `"${JOB_KEY}":`
	let searchFrom = 0

	while (true) {
		const keyIdx = text.indexOf(keyPattern, searchFrom)
		if (keyIdx === -1) break

		searchFrom = keyIdx + keyPattern.length

		// Find the opening bracket of the value array
		let i = searchFrom
		while (i < text.length && text[i] !== "[") {
			// If we hit something other than whitespace before a bracket, skip
			if (text[i] !== " " && text[i] !== "\n" && text[i] !== "\t") break
			i++
		}
		if (i >= text.length || text[i] !== "[") continue

		// Balance brackets to extract the full array
		const arrStart = i
		let depth = 1
		i++
		while (i < text.length && depth > 0) {
			const ch = text[i]
			if (ch === "[") depth++
			else if (ch === "]") depth--
			else if (ch === '"') {
				// Skip string content (handle escaped quotes)
				i++
				while (
					i < text.length &&
					!(text[i] === '"' && text[i - 1] !== "\\")
				) {
					i++
				}
			}
			i++
		}

		if (depth !== 0) continue

		try {
			const arr = JSON.parse(text.slice(arrStart, i)) as unknown[]
			if (!Array.isArray(arr) || arr.length < 20) continue

			const { applyUrl, applicationUrl } = extractApplyUrls(
				safeGet(arr, IDX.APPLY_OPTIONS),
			)

			jobs.push({
				title: safeString(safeGet(arr, IDX.TITLE)) ?? "",
				company: safeString(safeGet(arr, IDX.COMPANY)),
				location: safeString(safeGet(arr, IDX.LOCATION)),
				description: safeString(safeGet(arr, IDX.DESCRIPTION)),
				applyUrl,
				applicationUrl,
				postedAt: safeString(safeGet(arr, IDX.POSTED_AT)),
				employmentType: safeString(safeGet(arr, IDX.EMPLOYMENT_TYPE)),
				salaryText: safeString(safeGet(arr, IDX.SALARY_TEXT)),
				docId: safeString(safeGet(arr, IDX.DOC_ID)),
			})
		} catch {
			// Skip unparseable entries
		}
	}

	return jobs
}

export function unescapeXhrBody(body: string): string {
	return body.replace(/\\"/g, '"')
}
