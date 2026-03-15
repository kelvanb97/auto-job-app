import type { Database } from "@aja-app/supabase"
import { supabaseServerClient } from "@aja-core/supabase-next-auth/admin"
import { type TResult, errFrom, ok } from "@aja-core/result"
import type { TPerson, TListPersons } from "#schema/person-schema"
import { unmarshalPerson } from "#schema/person-marshallers"

export async function listPersons(
	input: TListPersons,
): Promise<TResult<{ persons: TPerson[]; hasNext: boolean }>> {
	const supabase = await supabaseServerClient<Database>()

	const start = (input.page - 1) * input.pageSize
	const end = start + input.pageSize

	let query = supabase
		.schema("app")
		.from("person")
		.select()

	if (input.search) {
		query = query.ilike("name", `%${input.search}%`)
	}
	if (input.email) {
		query = query.ilike("email", `%${input.email}%`)
	}
	if (input.companyId) {
		query = query.eq("company_id", input.companyId)
	}

	const { data, error } = await query.range(start, end)

	if (error) return errFrom(`Error listing persons: ${error.message}`)

	const hasNext = data.length > input.pageSize
	const persons = data.slice(0, input.pageSize).map(unmarshalPerson)

	return ok({ persons, hasNext })
}
