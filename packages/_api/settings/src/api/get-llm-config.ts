import { llmConfig } from "@rja-app/drizzle"
import type { TLlmConfig } from "@rja-app/drizzle"
import { db } from "@rja-core/drizzle"
import { errFrom, ok, type TResult } from "@rja-core/result"

export function getLlmConfig(): TResult<TLlmConfig | null> {
	try {
		const row = db().select().from(llmConfig).limit(1).get()
		return ok(row ?? null)
	} catch (e) {
		return errFrom(
			`Error fetching LLM config: ${e instanceof Error ? e.message : String(e)}`,
		)
	}
}
