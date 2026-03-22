import { updateRole } from "@aja-api/role/api/update-role"
import { ok, type TResult } from "@aja-core/result"

type TSkipRoleInput = {
	roleId: string
	reason?: string | undefined
}

export async function skipRole(input: TSkipRoleInput): Promise<TResult<void>> {
	const result = await updateRole({
		id: input.roleId,
		status: "wont_do",
		...(input.reason !== undefined && { notes: input.reason }),
	})

	if (!result.ok) return result

	return ok(undefined)
}
