"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { upsertScoreSchema } from "#schema/score-schema"
import { upsertScore } from "#api/upsert-score"

export const upsertScoreAction = actionClient
	.inputSchema(upsertScoreSchema)
	.action(async ({ parsedInput }) => {
		const result = await upsertScore(parsedInput)
		if (!result.ok)
			throw new UnknownServerError("upsertScoreAction", result.error)
		return { success: true, score: result.data }
	})
