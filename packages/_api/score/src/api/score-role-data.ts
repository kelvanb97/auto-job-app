import type { TCompany } from "@rja-api/company/schema/company-schema"
import type { TRole } from "@rja-api/role/schema/role-schema"
import { getScoringConfig } from "@rja-api/settings/api/get-scoring-config"
import { getUserProfile } from "@rja-api/settings/api/get-user-profile"
import {
	DEFAULT_SCORING_WEIGHTS,
	type TScoringConfig,
} from "@rja-api/settings/schema/scoring-config-schema"
import { errFrom, type TResult } from "@rja-core/result"
import { scoreRole } from "#lib/llm-client"
import { buildScoringPrompt } from "#prompt/scoring-prompt"
import type { TScore } from "#schema/score-schema"
import { upsertScore } from "./upsert-score"

export async function scoreRoleData(
	role: TRole,
	company: TCompany | null,
): Promise<TResult<TScore>> {
	try {
		const profileResult = getUserProfile()
		if (!profileResult.ok) return errFrom("User profile not configured")

		const scoringResult = getScoringConfig()
		if (!scoringResult.ok) return errFrom(scoringResult.error.message)

		const weights: TScoringConfig = scoringResult.data ?? {
			id: 0,
			userProfileId: profileResult.data.id,
			...DEFAULT_SCORING_WEIGHTS,
			createdAt: null,
			updatedAt: null,
		}

		const { system, user } = buildScoringPrompt(
			role,
			company,
			profileResult.data,
			weights,
		)
		const response = await scoreRole(system, user)
		return upsertScore({
			roleId: role.id,
			score: Math.round(response.score),
			positive: response.positive,
			negative: response.negative,
		})
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err)
		return errFrom(`Failed to score role ${role.id}: ${message}`)
	}
}
