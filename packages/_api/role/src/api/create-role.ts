import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import { marshalCreateRole, unmarshalRole } from "#schema/role-marshallers"
import type { TCreateRole, TRole } from "#schema/role-schema"

export async function createRole(input: TCreateRole): Promise<TResult<TRole>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("role")
		.insert(marshalCreateRole(input))
		.select()
		.single()

	if (error) return errFrom(`Error creating role: ${error.message}`)

	return ok(unmarshalRole(data))
}
