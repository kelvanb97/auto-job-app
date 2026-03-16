import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import {
	marshalCreateCompany,
	unmarshalCompany,
} from "#schema/company-marshallers"
import type { TCompany, TCreateCompany } from "#schema/company-schema"

export async function createCompany(
	input: TCreateCompany,
): Promise<TResult<TCompany>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("company")
		.insert(marshalCreateCompany(input))
		.select()
		.single()

	if (error) return errFrom(`Error creating company: ${error.message}`)

	return ok(unmarshalCompany(data))
}
