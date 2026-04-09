import { getLlmConfigForUseCase } from "@rja-api/settings/api/get-llm-config-for-use-case"
import { createMessage } from "@rja-integrations/llm/client"
import { keywordExtractionSchema } from "#schema/keyword-schema"
import type { TKeywordExtraction } from "#schema/keyword-schema"

export async function extractKeywords(
	system: string,
	user: string,
): Promise<TKeywordExtraction> {
	const configResult = getLlmConfigForUseCase("keyword")
	if (!configResult.ok) throw configResult.error
	return createMessage(configResult.data, {
		system,
		user,
		maxTokens: 1024,
		schema: keywordExtractionSchema,
	})
}
