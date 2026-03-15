"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { deleteScoreSchema } from "#schema/score-schema"
import { deleteScore } from "#api/delete-score"

export const deleteScoreAction = actionClient
	.inputSchema(deleteScoreSchema)
	.action(async ({ parsedInput }) => {
		const result = await deleteScore(parsedInput.id)
		if (!result.ok)
			throw new UnknownServerError("deleteScoreAction", result.error)
		return { success: true, id: parsedInput.id }
	})
