import { llmConfig } from "@rja-app/drizzle"
import type { TLlmConfig } from "@rja-app/drizzle"
import { db } from "@rja-core/drizzle"
import { errFrom, ok, type TResult } from "@rja-core/result"
import type { TUpsertLlmConfig } from "#schema/llm-config-schema"

export function upsertLlmConfig(input: TUpsertLlmConfig): TResult<TLlmConfig> {
	try {
		const result = db()
			.insert(llmConfig)
			.values(input)
			.onConflictDoUpdate({
				target: llmConfig.userProfileId,
				set: {
					anthropicApiKey: input.anthropicApiKey,
					openaiApiKey: input.openaiApiKey,
					scoringProvider: input.scoringProvider,
					scoringModel: input.scoringModel,
					keywordProvider: input.keywordProvider,
					keywordModel: input.keywordModel,
					resumeProvider: input.resumeProvider,
					resumeModel: input.resumeModel,
					coverLetterProvider: input.coverLetterProvider,
					coverLetterModel: input.coverLetterModel,
				},
			})
			.returning()
			.get()
		return ok(result)
	} catch (e) {
		return errFrom(
			`Error upserting LLM config: ${e instanceof Error ? e.message : String(e)}`,
		)
	}
}
