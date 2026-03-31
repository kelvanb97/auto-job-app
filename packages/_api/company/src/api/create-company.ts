import { company } from "@aja-app/drizzle"
import { db } from "@aja-core/drizzle"
import { errFrom, ok, type TResult } from "@aja-core/result"
import type { TCompany, TCreateCompany } from "#schema/company-schema"

export function createCompany(input: TCreateCompany): TResult<TCompany> {
	try {
		const row = db().insert(company).values(input).returning().get()
		return ok(row)
	} catch (e) {
		return errFrom(
			`Error creating company: ${e instanceof Error ? e.message : String(e)}`,
		)
	}
}
