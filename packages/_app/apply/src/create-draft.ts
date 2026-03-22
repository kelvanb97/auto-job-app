import { createApplication } from "@aja-api/application/api/create-application"
import { ok, type TResult } from "@aja-core/result"
import type { TCreateDraftResult } from "./types"

type TCreateDraftInput = {
	roleId: string
	notes?: string | undefined
}

export async function createDraft(
	input: TCreateDraftInput,
): Promise<TResult<TCreateDraftResult>> {
	const result = await createApplication({
		roleId: input.roleId,
		status: "draft",
		notes: input.notes ?? null,
	})

	if (!result.ok) return result

	return ok({
		applicationId: result.data.id,
		resumePath: result.data.resumePath,
		coverLetterPath: result.data.coverLetterPath,
	})
}
