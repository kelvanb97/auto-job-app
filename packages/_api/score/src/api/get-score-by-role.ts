import type { Database } from "@aja-app/supabase"
import { supabaseServerClient } from "@aja-core/supabase-next-auth/admin"
import { type TResult, errFrom, ok } from "@aja-core/result"
import type { TScore } from "#schema/score-schema"
import { unmarshalScore } from "#schema/score-marshallers"

export async function getScoreByRole(
	roleId: string,
): Promise<TResult<TScore | null>> {
	const supabase = await supabaseServerClient<Database>()

	const { data, error } = await supabase
		.schema("app")
		.from("score")
		.select()
		.eq("role_id", roleId)
		.maybeSingle()

	if (error) return errFrom(`Error fetching score: ${error.message}`)

	return ok(data ? unmarshalScore(data) : null)
}
