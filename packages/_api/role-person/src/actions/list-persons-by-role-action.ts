"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { listPersonsByRoleSchema } from "#schema/role-person-schema"
import { listPersonsByRole } from "#api/list-persons-by-role"

export const listPersonsByRoleAction = actionClient
	.inputSchema(listPersonsByRoleSchema)
	.action(async ({ parsedInput }) => {
		const result = await listPersonsByRole(parsedInput.roleId)
		if (!result.ok)
			throw new UnknownServerError("listPersonsByRoleAction", result.error)
		return { success: true, rolePersons: result.data }
	})
