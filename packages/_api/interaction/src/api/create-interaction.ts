import { interaction } from "@aja-app/drizzle"
import { db } from "@aja-core/drizzle"
import { errFrom, ok, type TResult } from "@aja-core/result"
import type {
	TCreateInteraction,
	TInteraction,
} from "#schema/interaction-schema"

export function createInteraction(
	input: TCreateInteraction,
): TResult<TInteraction> {
	try {
		const row = db().insert(interaction).values(input).returning().get()
		return ok(row)
	} catch (e) {
		return errFrom(
			`Error creating interaction: ${e instanceof Error ? e.message : String(e)}`,
		)
	}
}
