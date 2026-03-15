"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { getRoleSchema } from "#schema/role-schema"
import { getRole } from "#api/get-role"

export const getRoleAction = actionClient
	.inputSchema(getRoleSchema)
	.action(async ({ parsedInput }) => {
		const result = await getRole(parsedInput.id)
		if (!result.ok)
			throw new UnknownServerError("getRoleAction", result.error)
		return { success: true, role: result.data }
	})
