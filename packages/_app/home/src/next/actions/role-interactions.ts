"use server"

import { createInteraction } from "@aja-api/interaction/api/create-interaction"
import { deleteInteraction } from "@aja-api/interaction/api/delete-interaction"
import { listInteractions } from "@aja-api/interaction/api/list-interactions"
import { actionClient, SafeForClientError } from "@aja-core/next-safe-action"
import { z } from "zod"

export const listRoleInteractionsAction = actionClient
	.inputSchema(z.object({ roleId: z.string() }))
	.action(async ({ parsedInput }) => {
		const result = await listInteractions({
			roleId: parsedInput.roleId,
			page: 1,
			pageSize: 100,
		})
		if (!result.ok) {
			throw new SafeForClientError(result.error.message)
		}
		return result.data.interactions
	})

export const createRoleInteractionAction = actionClient
	.inputSchema(
		z.object({
			roleId: z.string(),
			personId: z.string().nullable().optional(),
			type: z.string().min(1),
			notes: z.string().nullable().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const result = await createInteraction(parsedInput)
		if (!result.ok) {
			throw new SafeForClientError(result.error.message)
		}
		return result.data
	})

export const deleteRoleInteractionAction = actionClient
	.inputSchema(z.object({ id: z.string() }))
	.action(async ({ parsedInput }) => {
		const result = await deleteInteraction(parsedInput.id)
		if (!result.ok) {
			throw new SafeForClientError(result.error.message)
		}
		return result.data
	})
