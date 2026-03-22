import { updateApplication } from "@aja-api/application/api/update-application"
import { updateRole } from "@aja-api/role/api/update-role"
import { errFrom, ok, type TResult } from "@aja-core/result"

type TSubmitInput = {
	applicationId: string
	roleId: string
}

export async function submitApplication(
	input: TSubmitInput,
): Promise<TResult<void>> {
	const appResult = await updateApplication({
		id: input.applicationId,
		status: "submitted",
		submittedAt: new Date().toISOString(),
	})
	if (!appResult.ok)
		return errFrom(
			`Failed to update application: ${appResult.error.message}`,
		)

	const roleResult = await updateRole({
		id: input.roleId,
		status: "applied",
	})
	if (!roleResult.ok)
		return errFrom(`Failed to update role: ${roleResult.error.message}`)

	return ok(undefined)
}
