export function parsePostedAt(raw: string | null): string | null {
	if (!raw) return null
	const now = new Date()
	const lower = raw.toLowerCase()
	const hoursMatch = lower.match(/(\d+)\s*hour/)
	const daysMatch = lower.match(/(\d+)\s*day/)
	if (hoursMatch) {
		now.setHours(now.getHours() - parseInt(hoursMatch[1]!, 10))
		return now.toISOString().split("T")[0] ?? null
	}
	if (daysMatch) {
		now.setDate(now.getDate() - parseInt(daysMatch[1]!, 10))
		return now.toISOString().split("T")[0] ?? null
	}
	return null
}

export function parseSalary(salaryText: string | null): {
	min: number | null
	max: number | null
} {
	if (!salaryText) return { min: null, max: null }
	// Matches patterns like "150,144–205,344 a year" or "$120K - $180K"
	const numbers = salaryText.match(/[\d,]+/g)
	if (!numbers || numbers.length === 0) return { min: null, max: null }

	const parsed = numbers.map((n) => parseInt(n.replace(/,/g, ""), 10))

	// If the text says "a year" or "annually", these are annual figures
	// If values look like they're in thousands (< 1000), multiply by 1000
	const normalize = (v: number) => (v > 0 && v < 1000 ? v * 1000 : v)

	if (parsed.length >= 2) {
		return { min: normalize(parsed[0]!), max: normalize(parsed[1]!) }
	}
	return { min: normalize(parsed[0]!), max: null }
}
