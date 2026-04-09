import { getLlmConfigForUseCase } from "@rja-api/settings/api/get-llm-config-for-use-case"
import { createMessage } from "@rja-integrations/llm/client"
import { coverLetterResponseSchema } from "#schema/cover-letter-schema"
import type { TCoverLetterResponse } from "#schema/cover-letter-schema"

export async function generateCoverLetterContent(
	system: string,
	user: string,
): Promise<TCoverLetterResponse> {
	const configResult = getLlmConfigForUseCase("coverLetter")
	if (!configResult.ok) throw configResult.error
	return createMessage(configResult.data, {
		system,
		user,
		maxTokens: 2048,
		schema: coverLetterResponseSchema,
	})
}
