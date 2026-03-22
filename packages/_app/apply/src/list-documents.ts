import { listFiles } from "@aja-api/storage/api/list-files"
import type { TResult } from "@aja-core/result"

export async function listDocuments(
	roleId: string,
): Promise<TResult<Array<{ name: string }>>> {
	return listFiles("applications", roleId)
}
