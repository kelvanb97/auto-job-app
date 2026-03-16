import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import {
	marshalUpdateInteraction,
	unmarshalInteraction,
} from "#schema/interaction-marshallers"
import type {
	TInteraction,
	TUpdateInteraction,
} from "#schema/interaction-schema"

export async function updateInteraction(
	input: TUpdateInteraction,
): Promise<TResult<TInteraction>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("interaction")
		.update(marshalUpdateInteraction(input))
		.eq("id", input.id)
		.select()
		.single()

	if (error) return errFrom(`Error updating interaction: ${error.message}`)

	return ok(unmarshalInteraction(data))
}
