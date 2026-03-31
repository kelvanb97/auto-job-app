import { score } from "@aja-app/drizzle"
import { db } from "@aja-core/drizzle"
import { errFrom, ok, type TResult } from "@aja-core/result"
import type { TScore } from "#schema/score-schema"
import { inArray } from "drizzle-orm"

export function listScoresByRoles(roleIds: number[]): TResult<TScore[]> {
	if (roleIds.length === 0) return ok([])

	try {
		const rows = db()
			.select()
			.from(score)
			.where(inArray(score.roleId, roleIds))
			.all()
		return ok(rows)
	} catch (e) {
		return errFrom(
			`Error listing scores: ${e instanceof Error ? e.message : String(e)}`,
		)
	}
}
