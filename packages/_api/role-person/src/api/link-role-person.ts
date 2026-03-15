import type { Database } from "@aja-app/supabase"
import { supabaseServerClient } from "@aja-core/supabase-next-auth/admin"
import { type TResult, errFrom, ok } from "@aja-core/result"
import type { TRolePerson, TLinkRolePerson } from "#schema/role-person-schema"
import { unmarshalRolePerson } from "#schema/role-person-marshallers"

export async function linkRolePerson(
	input: TLinkRolePerson,
): Promise<TResult<TRolePerson>> {
	const supabase = await supabaseServerClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("role_person")
		.insert({
			role_id: input.roleId,
			person_id: input.personId,
			relationship: input.relationship ?? null,
		})
		.select()
		.single()

	if (error) return errFrom(`Error linking role-person: ${error.message}`)

	return ok(unmarshalRolePerson(data))
}
