import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import {
	marshalCreateApplication,
	unmarshalApplication,
} from "#schema/application-marshallers"
import type {
	TApplication,
	TCreateApplication,
} from "#schema/application-schema"

export async function createApplication(
	input: TCreateApplication,
): Promise<TResult<TApplication>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("application")
		.insert(marshalCreateApplication(input))
		.select()
		.single()

	if (error) return errFrom(`Error creating application: ${error.message}`)

	return ok(unmarshalApplication(data))
}
