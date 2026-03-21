import { createMessage } from "@aja-integrations/anthropic/client"
import type { TAnthropicModel } from "@aja-integrations/anthropic/client"
import { coverLetterResponseSchema } from "#schema/cover-letter-schema"
import type { TCoverLetterResponse } from "#schema/cover-letter-schema"

export async function generateCoverLetterContent(
	model: TAnthropicModel,
	system: string,
	user: string,
): Promise<TCoverLetterResponse> {
	return createMessage({
		model,
		system,
		user,
		maxTokens: 2048,
		schema: coverLetterResponseSchema,
	})
}
