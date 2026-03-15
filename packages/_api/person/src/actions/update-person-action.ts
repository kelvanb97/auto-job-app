"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { updatePersonSchema } from "#schema/person-schema"
import { updatePerson } from "#api/update-person"

export const updatePersonAction = actionClient
	.inputSchema(updatePersonSchema)
	.action(async ({ parsedInput }) => {
		const result = await updatePerson(parsedInput)
		if (!result.ok)
			throw new UnknownServerError("updatePersonAction", result.error)
		return { success: true, person: result.data }
	})
