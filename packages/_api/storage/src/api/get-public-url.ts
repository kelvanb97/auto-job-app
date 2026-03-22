import type { Database } from "@aja-app/supabase"
import { ok, type TResult } from "@aja-core/result"
import { supabaseAdminClient } from "@aja-core/supabase/admin"

export function getPublicUrl(bucket: string, path: string): TResult<string> {
	const supabase = supabaseAdminClient<Database>()

	const {
		data: { publicUrl },
	} = supabase.storage.from(bucket).getPublicUrl(path)

	return ok(publicUrl)
}
