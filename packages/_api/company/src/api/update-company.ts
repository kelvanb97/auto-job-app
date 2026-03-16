import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import {
	marshalUpdateCompany,
	unmarshalCompany,
} from "#schema/company-marshallers"
import type { TCompany, TUpdateCompany } from "#schema/company-schema"

export async function updateCompany(
	input: TUpdateCompany,
): Promise<TResult<TCompany>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("company")
		.update(marshalUpdateCompany(input))
		.eq("id", input.id)
		.select()
		.single()

	if (error) return errFrom(`Error updating company: ${error.message}`)

	return ok(unmarshalCompany(data))
}
