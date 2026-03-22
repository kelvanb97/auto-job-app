import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"

export async function downloadFile(
	bucket: string,
	path: string,
): Promise<TResult<Buffer>> {
	const supabase = supabaseAdminClient<Database>()

	const { data, error } = await supabase.storage.from(bucket).download(path)

	if (error) return errFrom(`Error downloading ${path}: ${error.message}`)

	const buffer = Buffer.from(await data.arrayBuffer())
	return ok(buffer)
}
