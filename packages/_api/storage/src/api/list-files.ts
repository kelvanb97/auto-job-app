import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"

export async function listFiles(
	bucket: string,
	folder: string,
	options?: { search?: string },
): Promise<TResult<Array<{ name: string }>>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase.storage.from(bucket).list(folder, {
		...(options?.search !== undefined && { search: options.search }),
	})

	if (error)
		return errFrom(`Error listing files in ${folder}: ${error.message}`)

	return ok(data.map((f) => ({ name: f.name })))
}
