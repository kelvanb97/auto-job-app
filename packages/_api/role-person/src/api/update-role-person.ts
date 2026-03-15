import type { Database } from "@aja-app/supabase"
import { supabaseServerClient } from "@aja-core/supabase-next-auth/admin"
import { type TResult, errFrom, ok } from "@aja-core/result"
import type { TRolePerson, TUpdateRolePerson } from "#schema/role-person-schema"
import { unmarshalRolePerson } from "#schema/role-person-marshallers"

export async function updateRolePerson(
	input: TUpdateRolePerson,
): Promise<TResult<TRolePerson>> {
	const supabase = await supabaseServerClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("role_person")
		.update({ relationship: input.relationship })
		.eq("role_id", input.roleId)
		.eq("person_id", input.personId)
		.select()
		.single()

	if (error) return errFrom(`Error updating role-person: ${error.message}`)

	return ok(unmarshalRolePerson(data))
}
