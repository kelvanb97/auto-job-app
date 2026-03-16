import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import {
	marshalUpdateApplication,
	unmarshalApplication,
} from "#schema/application-marshallers"
import type {
	TApplication,
	TUpdateApplication,
} from "#schema/application-schema"

export async function updateApplication(
	input: TUpdateApplication,
): Promise<TResult<TApplication>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("application")
		.update(marshalUpdateApplication(input))
		.eq("id", input.id)
		.select()
		.single()

	if (error) return errFrom(`Error updating application: ${error.message}`)

	return ok(unmarshalApplication(data))
}
