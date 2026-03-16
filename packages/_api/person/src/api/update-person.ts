import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import {
	marshalUpdatePerson,
	unmarshalPerson,
} from "#schema/person-marshallers"
import type { TPerson, TUpdatePerson } from "#schema/person-schema"

export async function updatePerson(
	input: TUpdatePerson,
): Promise<TResult<TPerson>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("person")
		.update(marshalUpdatePerson(input))
		.eq("id", input.id)
		.select()
		.single()

	if (error) return errFrom(`Error updating person: ${error.message}`)

	return ok(unmarshalPerson(data))
}
