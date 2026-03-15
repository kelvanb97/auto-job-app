"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { updateRoleSchema } from "#schema/role-schema"
import { updateRole } from "#api/update-role"

export const updateRoleAction = actionClient
	.inputSchema(updateRoleSchema)
	.action(async ({ parsedInput }) => {
		const result = await updateRole(parsedInput)
		if (!result.ok)
			throw new UnknownServerError("updateRoleAction", result.error)
		return { success: true, role: result.data }
	})
