"use server"

import { scoreRoleById } from "@aja-api/score/api/score-role-by-id"
import { actionClient, SafeForClientError } from "@aja-core/next-safe-action"
import { z } from "zod"

const scoreRoleSchema = z.object({
	roleId: z.number(),
})

export const scoreRoleAction = actionClient
	.inputSchema(scoreRoleSchema)
	.action(async ({ parsedInput }) => {
		const result = await scoreRoleById(parsedInput.roleId)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})
