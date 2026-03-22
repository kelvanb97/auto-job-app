import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"

export async function uploadFile(
	bucket: string,
	path: string,
	file: File | Buffer,
	options?: { contentType?: string; upsert?: boolean },
): Promise<TResult<void>> {
	const supabase = supabaseAdminClient<Database>()

	const { error } = await supabase.storage.from(bucket).upload(path, file, {
		...(options?.contentType !== undefined && {
			contentType: options.contentType,
		}),
		...(options?.upsert !== undefined && { upsert: options.upsert }),
	})

	if (error) return errFrom(`Error uploading ${path}: ${error.message}`)

	return ok(undefined)
}
