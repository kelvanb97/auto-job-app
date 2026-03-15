"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { linkRolePersonSchema } from "#schema/role-person-schema"
import { linkRolePerson } from "#api/link-role-person"

export const linkRolePersonAction = actionClient
	.inputSchema(linkRolePersonSchema)
	.action(async ({ parsedInput }) => {
		const result = await linkRolePerson(parsedInput)
		if (!result.ok)
			throw new UnknownServerError("linkRolePersonAction", result.error)
		return { success: true, rolePerson: result.data }
	})
