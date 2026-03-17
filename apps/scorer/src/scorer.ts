import { listUnscoredRoles } from "@aja-api/role/api/list-unscored-roles"
import { scoreRoleById } from "@aja-api/score/api/score-role-by-id"

const RATE_LIMIT_MS = Number(process.env["SCORER_RATE_LIMIT_MS"] ?? "500")

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

type ScorerSummary = {
	scored: number
	errors: number
	total: number
}

export async function runScorer(): Promise<ScorerSummary> {
	const result = await listUnscoredRoles()
	if (!result.ok) {
		throw new Error(result.error.message)
	}

	const roles = result.data
	console.log(`[scorer] Found ${roles.length} unscored roles`)

	if (roles.length === 0) {
		return { scored: 0, errors: 0, total: 0 }
	}

	let scored = 0
	let errors = 0

	for (const role of roles) {
		const scoreResult = await scoreRoleById(role.id)

		if (scoreResult.ok) {
			scored++
			console.log(`[scorer] "${role.title}" → ${scoreResult.data.score}`)
		} else {
			errors++
			console.warn(
				`[scorer] "${role.title}": ${scoreResult.error.message}`,
			)
		}

		await delay(RATE_LIMIT_MS)
	}

	return { scored, errors, total: roles.length }
}
