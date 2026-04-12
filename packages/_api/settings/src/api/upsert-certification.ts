import { certification } from "@rja-app/drizzle"
import type { TCertification } from "@rja-app/drizzle"
import { db } from "@rja-core/drizzle"
import { errFrom, ok, type TResult } from "@rja-core/result"
import type { TUpsertCertification } from "#schema/user-profile-schema"
import { eq } from "drizzle-orm"

export function upsertCertification(
	input: TUpsertCertification,
): TResult<TCertification> {
	try {
		if (input.id) {
			const result = db()
				.update(certification)
				.set(input)
				.where(eq(certification.id, input.id))
				.returning()
				.get()
			if (!result) return errFrom("Certification not found")
			return ok(result)
		}

		const result = db()
			.insert(certification)
			.values(input)
			.returning()
			.get()
		return ok(result)
	} catch (e) {
		return errFrom(
			`Error upserting certification: ${e instanceof Error ? e.message : String(e)}`,
		)
	}
}
