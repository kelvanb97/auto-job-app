"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { listRolesByPersonSchema } from "#schema/role-person-schema"
import { listRolesByPerson } from "#api/list-roles-by-person"

export const listRolesByPersonAction = actionClient
	.inputSchema(listRolesByPersonSchema)
	.action(async ({ parsedInput }) => {
		const result = await listRolesByPerson(parsedInput.personId)
		if (!result.ok)
			throw new UnknownServerError("listRolesByPersonAction", result.error)
		return { success: true, rolePersons: result.data }
	})
