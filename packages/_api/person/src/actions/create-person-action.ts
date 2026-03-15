"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { createPersonSchema } from "#schema/person-schema"
import { createPerson } from "#api/create-person"

export const createPersonAction = actionClient
	.inputSchema(createPersonSchema)
	.action(async ({ parsedInput }) => {
		const result = await createPerson(parsedInput)
		if (!result.ok)
			throw new UnknownServerError("createPersonAction", result.error)
		return { success: true, person: result.data }
	})
