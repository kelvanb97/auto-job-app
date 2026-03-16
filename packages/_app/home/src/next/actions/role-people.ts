"use server"

import { createPerson } from "@aja-api/person/api/create-person"
import { getPerson } from "@aja-api/person/api/get-person"
import { listPersons } from "@aja-api/person/api/list-persons"
import { linkRolePerson } from "@aja-api/role-person/api/link-role-person"
import { listPersonsByRole } from "@aja-api/role-person/api/list-persons-by-role"
import { unlinkRolePerson } from "@aja-api/role-person/api/unlink-role-person"
import { actionClient, SafeForClientError } from "@aja-core/next-safe-action"
import { z } from "zod"

export const listRolePeopleAction = actionClient
	.inputSchema(z.object({ roleId: z.string() }))
	.action(async ({ parsedInput }) => {
		const result = await listPersonsByRole(parsedInput.roleId)
		if (!result.ok) {
			throw new SafeForClientError(result.error.message)
		}

		const people = await Promise.all(
			result.data.map(async (rp) => {
				const personResult = await getPerson(rp.personId)
				if (!personResult.ok) {
					throw new SafeForClientError(personResult.error.message)
				}
				return { rolePerson: rp, person: personResult.data }
			}),
		)

		return people
	})

export const linkPersonToRoleAction = actionClient
	.inputSchema(
		z.object({
			roleId: z.string(),
			personId: z.string(),
			relationship: z.string().nullable().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const result = await linkRolePerson(parsedInput)
		if (!result.ok) {
			throw new SafeForClientError(result.error.message)
		}
		return result.data
	})

export const unlinkPersonFromRoleAction = actionClient
	.inputSchema(z.object({ roleId: z.string(), personId: z.string() }))
	.action(async ({ parsedInput }) => {
		const result = await unlinkRolePerson(
			parsedInput.roleId,
			parsedInput.personId,
		)
		if (!result.ok) {
			throw new SafeForClientError(result.error.message)
		}
		return result.data
	})

export const searchPersonsAction = actionClient
	.inputSchema(z.object({ search: z.string() }))
	.action(async ({ parsedInput }) => {
		const result = await listPersons({
			search: parsedInput.search,
			page: 1,
			pageSize: 10,
		})
		if (!result.ok) {
			throw new SafeForClientError(result.error.message)
		}
		return result.data.persons
	})

export const createAndLinkPersonAction = actionClient
	.inputSchema(
		z.object({
			roleId: z.string(),
			name: z.string().min(1),
			email: z.string().nullable().optional(),
			title: z.string().nullable().optional(),
			linkedinUrl: z.string().nullable().optional(),
			notes: z.string().nullable().optional(),
			relationship: z.string().nullable().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const personResult = await createPerson({
			name: parsedInput.name,
			email: parsedInput.email,
			title: parsedInput.title,
			linkedinUrl: parsedInput.linkedinUrl,
			notes: parsedInput.notes,
		})
		if (!personResult.ok) {
			throw new SafeForClientError(personResult.error.message)
		}

		const linkResult = await linkRolePerson({
			roleId: parsedInput.roleId,
			personId: personResult.data.id,
			relationship: parsedInput.relationship,
		})
		if (!linkResult.ok) {
			throw new SafeForClientError(linkResult.error.message)
		}

		return { rolePerson: linkResult.data, person: personResult.data }
	})
