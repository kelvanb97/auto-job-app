import type { Database } from "@aja-app/supabase"
import { supabaseServerClient } from "@aja-core/supabase-next-auth/admin"
import { type TResult, errFrom, ok } from "@aja-core/result"
import type { TRolePerson } from "#schema/role-person-schema"
import { unmarshalRolePerson } from "#schema/role-person-marshallers"

export async function listPersonsByRole(
	roleId: string,
): Promise<TResult<TRolePerson[]>> {
	const supabase = await supabaseServerClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("role_person")
		.select()
		.eq("role_id", roleId)

	if (error) return errFrom(`Error listing persons by role: ${error.message}`)

	return ok(data.map(unmarshalRolePerson))
}
