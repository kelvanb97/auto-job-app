import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"
import {
	marshalLinkRolePerson,
	unmarshalRolePerson,
} from "#schema/role-person-marshallers"
import type { TLinkRolePerson, TRolePerson } from "#schema/role-person-schema"

export async function linkRolePerson(
	input: TLinkRolePerson,
): Promise<TResult<TRolePerson>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("role_person")
		.insert(marshalLinkRolePerson(input))
		.select()
		.single()

	if (error) return errFrom(`Error linking role-person: ${error.message}`)

	return ok(unmarshalRolePerson(data))
}
