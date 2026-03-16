import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import {
	marshalCreateInteraction,
	unmarshalInteraction,
} from "#schema/interaction-marshallers"
import type {
	TCreateInteraction,
	TInteraction,
} from "#schema/interaction-schema"

export async function createInteraction(
	input: TCreateInteraction,
): Promise<TResult<TInteraction>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("interaction")
		.insert(marshalCreateInteraction(input))
		.select()
		.single()

	if (error) return errFrom(`Error creating interaction: ${error.message}`)

	return ok(unmarshalInteraction(data))
}
