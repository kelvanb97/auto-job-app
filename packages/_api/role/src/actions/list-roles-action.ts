"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { listRolesSchema } from "#schema/role-schema"
import { listRoles } from "#api/list-roles"

export const listRolesAction = actionClient
	.inputSchema(listRolesSchema)
	.action(async ({ parsedInput }) => {
		const result = await listRoles(parsedInput)
		if (!result.ok)
			throw new UnknownServerError("listRolesAction", result.error)
		return {
			success: true,
			roles: result.data.roles,
			page: parsedInput.page,
			pageSize: parsedInput.pageSize,
			hasNext: result.data.hasNext,
		}
	})
