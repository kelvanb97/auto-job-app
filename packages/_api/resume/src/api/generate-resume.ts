import { getLlmConfigForUseCase } from "@rja-api/settings/api/get-llm-config-for-use-case"
import { createMessage } from "@rja-integrations/llm/client"
import { resumeResponseSchema } from "#schema/resume-schema"
import type { TResumeResponse } from "#schema/resume-schema"

export async function generateResumeContent(
	system: string,
	user: string,
): Promise<TResumeResponse> {
	const configResult = getLlmConfigForUseCase("resume")
	if (!configResult.ok) throw configResult.error
	return createMessage(configResult.data, {
		system,
		user,
		maxTokens: 4096,
		schema: resumeResponseSchema,
	})
}
