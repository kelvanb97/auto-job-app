import type { Database } from "@aja-app/supabase"
import { supabaseServerClient } from "@aja-core/supabase-next-auth/admin"
import { type TResult, errFrom, ok } from "@aja-core/result"

export async function unlinkRolePerson(
	roleId: string,
	personId: string,
): Promise<TResult<{ roleId: string; personId: string }>> {
	const supabase = await supabaseServerClient<Database>()

	const { error } = await supabase
		.schema("app")
		.from("role_person")
		.delete()
		.eq("role_id", roleId)
		.eq("person_id", personId)

	if (error) return errFrom(`Error unlinking role-person: ${error.message}`)

	return ok({ roleId, personId })
}
