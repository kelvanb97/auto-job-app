import { company } from "@aja-app/drizzle"
import { db } from "@aja-core/drizzle"
import { errFrom, ok, type TResult } from "@aja-core/result"
import type { TCompany } from "#schema/company-schema"
import { like } from "drizzle-orm"

export function findCompanyByName(name: string): TResult<TCompany | null> {
	try {
		const row = db()
			.select()
			.from(company)
			.where(like(company.name, name))
			.get()
		return ok(row ?? null)
	} catch (e) {
		return errFrom(
			`Error finding company: ${e instanceof Error ? e.message : String(e)}`,
		)
	}
}
