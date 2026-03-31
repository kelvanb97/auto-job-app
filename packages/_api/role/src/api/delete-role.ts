import { role } from "@aja-app/drizzle"
import { db } from "@aja-core/drizzle"
import { errFrom, ok, type TResult } from "@aja-core/result"
import { eq } from "drizzle-orm"

export function deleteRole(id: number): TResult<{ id: number }> {
	try {
		db().delete(role).where(eq(role.id, id)).run()
		return ok({ id })
	} catch (e) {
		return errFrom(
			`Error deleting role: ${e instanceof Error ? e.message : String(e)}`,
		)
	}
}
