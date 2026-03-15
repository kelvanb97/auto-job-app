import type { Database } from "@aja-app/supabase"
import { supabaseServerClient } from "@aja-core/supabase-next-auth/admin"
import { type TResult, errFrom, ok } from "@aja-core/result"
import type { TRole } from "#schema/role-schema"
import { unmarshalRole } from "#schema/role-marshallers"

export async function getRole(
	id: string,
): Promise<TResult<TRole>> {
	const supabase = await supabaseServerClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("role")
		.select()
		.eq("id", id)
		.single()

	if (error) return errFrom(`Error fetching role: ${error.message}`)

	return ok(unmarshalRole(data))
}
