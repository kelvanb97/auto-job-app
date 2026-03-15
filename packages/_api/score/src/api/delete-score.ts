import type { Database } from "@aja-app/supabase"
import { supabaseServerClient } from "@aja-core/supabase-next-auth/admin"
import { type TResult, errFrom, ok } from "@aja-core/result"

export async function deleteScore(
	id: string,
): Promise<TResult<{ id: string }>> {
	const supabase = await supabaseServerClient<Database>()

	const { error } = await supabase
		.schema("app")
		.from("score")
		.delete()
		.eq("id", id)

	if (error) return errFrom(`Error deleting score: ${error.message}`)

	return ok({ id })
}
