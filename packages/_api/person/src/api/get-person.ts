import type { Database } from "@aja-app/supabase"
import { supabaseServerClient } from "@aja-core/supabase-next-auth/admin"
import { type TResult, errFrom, ok } from "@aja-core/result"
import type { TPerson } from "#schema/person-schema"
import { unmarshalPerson } from "#schema/person-marshallers"

export async function getPerson(
	id: string,
): Promise<TResult<TPerson>> {
	const supabase = await supabaseServerClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("person")
		.select()
		.eq("id", id)
		.single()

	if (error) return errFrom(`Error fetching person: ${error.message}`)

	return ok(unmarshalPerson(data))
}
