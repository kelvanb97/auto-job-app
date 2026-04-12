import { llmConfig } from "@rja-app/drizzle"
import type { TLlmConfig } from "@rja-app/drizzle"
import { db } from "@rja-core/drizzle"
import { errFrom, ok, type TResult } from "@rja-core/result"
import type { TUpsertLlmConfig } from "#schema/llm-config-schema"
import { eq } from "drizzle-orm"

export function upsertLlmConfig(input: TUpsertLlmConfig): TResult<TLlmConfig> {
	try {
		const existing = db()
			.select({ id: llmConfig.id })
			.from(llmConfig)
			.limit(1)
			.get()

		if (existing) {
			const result = db()
				.update(llmConfig)
				.set(input)
				.where(eq(llmConfig.id, existing.id))
				.returning()
				.get()
			return ok(result)
		}

		const result = db().insert(llmConfig).values(input).returning().get()
		return ok(result)
	} catch (e) {
		return errFrom(
			`Error upserting LLM config: ${e instanceof Error ? e.message : String(e)}`,
		)
	}
}
