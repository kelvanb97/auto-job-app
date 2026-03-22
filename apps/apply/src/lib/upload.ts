import { uploadFile } from "@aja-api/storage/api/upload-file"
import { ok, type TResult } from "@aja-core/result"

const DOCX_CONTENT_TYPE =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export async function uploadDocument(
	bucket: string,
	path: string,
	buffer: Buffer,
): Promise<TResult<string>> {
	const result = await uploadFile(bucket, path, buffer, {
		contentType: DOCX_CONTENT_TYPE,
		upsert: true,
	})

	if (!result.ok) return result

	return ok(path)
}
