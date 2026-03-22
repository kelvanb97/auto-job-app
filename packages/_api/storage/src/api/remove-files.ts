import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"

export async function removeFiles(
	bucket: string,
	paths: string[],
): Promise<TResult<void>> {
	const supabase = supabaseAdminClient<Database>()

	const { error } = await supabase.storage.from(bucket).remove(paths)

	if (error) return errFrom(`Error removing files: ${error.message}`)

	return ok(undefined)
}
