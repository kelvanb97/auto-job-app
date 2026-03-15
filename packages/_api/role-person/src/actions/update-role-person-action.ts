"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { updateRolePersonSchema } from "#schema/role-person-schema"
import { updateRolePerson } from "#api/update-role-person"

export const updateRolePersonAction = actionClient
	.inputSchema(updateRolePersonSchema)
	.action(async ({ parsedInput }) => {
		const result = await updateRolePerson(parsedInput)
		if (!result.ok)
			throw new UnknownServerError("updateRolePersonAction", result.error)
		return { success: true, rolePerson: result.data }
	})
