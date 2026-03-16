import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import { unmarshalCompany } from "#schema/company-marshallers"
import type { TCompany } from "#schema/company-schema"

export async function findCompanyByName(
	name: string,
): Promise<TResult<TCompany | null>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("company")
		.select()
		.ilike("name", name)
		.limit(1)
		.maybeSingle()

	if (error) return errFrom(`Error finding company: ${error.message}`)

	return ok(data ? unmarshalCompany(data) : null)
}
