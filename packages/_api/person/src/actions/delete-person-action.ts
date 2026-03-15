"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { deletePersonSchema } from "#schema/person-schema"
import { deletePerson } from "#api/delete-person"

export const deletePersonAction = actionClient
	.inputSchema(deletePersonSchema)
	.action(async ({ parsedInput }) => {
		const result = await deletePerson(parsedInput.id)
		if (!result.ok)
			throw new UnknownServerError("deletePersonAction", result.error)
		return { success: true, id: parsedInput.id }
	})
