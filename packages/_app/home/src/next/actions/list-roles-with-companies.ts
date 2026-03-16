"use server"

import { getCompany } from "@aja-api/company/api/get-company"
import { listRoles } from "@aja-api/role/api/list-roles"
import { listRolesSchema } from "@aja-api/role/schema/role-schema"
import { actionClient, SafeForClientError } from "@aja-core/next-safe-action"

export const listRolesWithCompaniesAction = actionClient
	.inputSchema(listRolesSchema)
	.action(async ({ parsedInput }) => {
		const result = await listRoles(parsedInput)
		if (!result.ok) {
			throw new SafeForClientError(result.error.message)
		}

		const companyIds = [
			...new Set(
				result.data.roles
					.map((r) => r.companyId)
					.filter((id): id is string => id !== null),
			),
		]

		const companyResults = await Promise.all(
			companyIds.map((id) => getCompany(id)),
		)
		const companies = companyResults
			.filter((r) => r.ok)
			.map((r) => r.data)

		return {
			roles: result.data.roles,
			companies,
			hasNext: result.data.hasNext,
		}
	})
