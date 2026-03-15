"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { listPersonsSchema } from "#schema/person-schema"
import { listPersons } from "#api/list-persons"

export const listPersonsAction = actionClient
	.inputSchema(listPersonsSchema)
	.action(async ({ parsedInput }) => {
		const result = await listPersons(parsedInput)
		if (!result.ok)
			throw new UnknownServerError("listPersonsAction", result.error)
		return {
			success: true,
			persons: result.data.persons,
			page: parsedInput.page,
			pageSize: parsedInput.pageSize,
			hasNext: result.data.hasNext,
		}
	})
