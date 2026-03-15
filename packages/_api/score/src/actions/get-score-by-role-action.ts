"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { getScoreByRoleSchema } from "#schema/score-schema"
import { getScoreByRole } from "#api/get-score-by-role"

export const getScoreByRoleAction = actionClient
	.inputSchema(getScoreByRoleSchema)
	.action(async ({ parsedInput }) => {
		const result = await getScoreByRole(parsedInput.roleId)
		if (!result.ok)
			throw new UnknownServerError("getScoreByRoleAction", result.error)
		return { success: true, score: result.data }
	})
