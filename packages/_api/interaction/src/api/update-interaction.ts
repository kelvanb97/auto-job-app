import { interaction } from "@aja-app/drizzle"
import { db } from "@aja-core/drizzle"
import { errFrom, ok, type TResult } from "@aja-core/result"
import type {
	TInteraction,
	TUpdateInteraction,
} from "#schema/interaction-schema"
import { eq } from "drizzle-orm"

export function updateInteraction(
	input: TUpdateInteraction,
): TResult<TInteraction> {
	try {
		const row = db()
			.update(interaction)
			.set(input)
			.where(eq(interaction.id, input.id))
			.returning()
			.get()
		if (!row) return errFrom(`Interaction not found: ${input.id}`)
		return ok(row)
	} catch (e) {
		return errFrom(
			`Error updating interaction: ${e instanceof Error ? e.message : String(e)}`,
		)
	}
}
