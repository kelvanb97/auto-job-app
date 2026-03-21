import type { Database } from "@aja-app/supabase"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"

const DOCX_CONTENT_TYPE =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export async function uploadDocument(
	bucket: string,
	path: string,
	buffer: Buffer,
): Promise<TResult<string>> {
	const supabase = supabaseAdminClient<Database>()

	const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
		contentType: DOCX_CONTENT_TYPE,
		upsert: true,
	})

	if (error) return errFrom(`Error uploading ${path}: ${error.message}`)

	return ok(path)
}
