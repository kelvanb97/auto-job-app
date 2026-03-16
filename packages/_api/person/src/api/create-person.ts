import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import {
	marshalCreatePerson,
	unmarshalPerson,
} from "#schema/person-marshallers"
import type { TCreatePerson, TPerson } from "#schema/person-schema"

export async function createPerson(
	input: TCreatePerson,
): Promise<TResult<TPerson>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("person")
		.insert(marshalCreatePerson(input))
		.select()
		.single()

	if (error) return errFrom(`Error creating person: ${error.message}`)

	return ok(unmarshalPerson(data))
}
