"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { getPersonSchema } from "#schema/person-schema"
import { getPerson } from "#api/get-person"

export const getPersonAction = actionClient
	.inputSchema(getPersonSchema)
	.action(async ({ parsedInput }) => {
		const result = await getPerson(parsedInput.id)
		if (!result.ok)
			throw new UnknownServerError("getPersonAction", result.error)
		return { success: true, person: result.data }
	})
