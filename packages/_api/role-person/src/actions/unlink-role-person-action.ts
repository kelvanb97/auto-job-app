"use server"

import {
	actionClient,
	UnknownServerError,
} from "@aja-core/next-safe-action"
import { unlinkRolePersonSchema } from "#schema/role-person-schema"
import { unlinkRolePerson } from "#api/unlink-role-person"

export const unlinkRolePersonAction = actionClient
	.inputSchema(unlinkRolePersonSchema)
	.action(async ({ parsedInput }) => {
		const result = await unlinkRolePerson(parsedInput.roleId, parsedInput.personId)
		if (!result.ok)
			throw new UnknownServerError("unlinkRolePersonAction", result.error)
		return { success: true, roleId: parsedInput.roleId, personId: parsedInput.personId }
	})
