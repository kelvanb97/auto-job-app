"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { createRoleSchema } from "#schema/role-schema"
import { createRole } from "#api/create-role"

export const createRoleAction = actionClient
	.inputSchema(createRoleSchema)
	.action(async ({ parsedInput }) => {
		const result = await createRole(parsedInput)
		if (!result.ok)
			throw new UnknownServerError("createRoleAction", result.error)
		return { success: true, role: result.data }
	})
