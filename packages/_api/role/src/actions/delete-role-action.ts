"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { deleteRoleSchema } from "#schema/role-schema"
import { deleteRole } from "#api/delete-role"

export const deleteRoleAction = actionClient
	.inputSchema(deleteRoleSchema)
	.action(async ({ parsedInput }) => {
		const result = await deleteRole(parsedInput.id)
		if (!result.ok)
			throw new UnknownServerError("deleteRoleAction", result.error)
		return { success: true, id: parsedInput.id }
	})
