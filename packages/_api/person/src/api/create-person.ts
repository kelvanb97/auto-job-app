import type { Database } from "@aja-app/supabase"
import { supabaseServerClient } from "@aja-core/supabase-next-auth/admin"
import { type TResult, errFrom, ok } from "@aja-core/result"
import type { TPerson, TCreatePerson } from "#schema/person-schema"
import { unmarshalPerson } from "#schema/person-marshallers"

export async function createPerson(
	input: TCreatePerson,
): Promise<TResult<TPerson>> {
	const supabase = await supabaseServerClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("person")
		.insert({
			company_id: input.companyId ?? null,
			name: input.name,
			title: input.title ?? null,
			email: input.email ?? null,
			linkedin_url: input.linkedinUrl ?? null,
			notes: input.notes ?? null,
		})
		.select()
		.single()

	if (error) return errFrom(`Error creating person: ${error.message}`)

	return ok(unmarshalPerson(data))
}
