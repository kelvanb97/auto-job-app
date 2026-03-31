"use server"

import { createInteraction } from "@aja-api/interaction/api/create-interaction"
import { deleteInteraction } from "@aja-api/interaction/api/delete-interaction"
import { listInteractions } from "@aja-api/interaction/api/list-interactions"
import { interactionTypeSchema } from "@aja-api/interaction/schema/interaction-schema"
import { actionClient, SafeForClientError } from "@aja-core/next-safe-action"
import { z } from "zod"

export const listRoleInteractionsAction = actionClient
	.inputSchema(z.object({ roleId: z.number() }))
	.action(async ({ parsedInput }) => {
		const result = listInteractions({
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
			roleId: z.number(),
			personId: z.number().nullable().optional(),
			type: interactionTypeSchema,
			notes: z.string().nullable().optional(),
		}),
	)
	.action(async ({ parsedInput }) => {
		const result = createInteraction(parsedInput)
		if (!result.ok) {
			throw new SafeForClientError(result.error.message)
		}
		return result.data
	})

export const deleteRoleInteractionAction = actionClient
	.inputSchema(z.object({ id: z.number() }))
	.action(async ({ parsedInput }) => {
		const result = deleteInteraction(parsedInput.id)
		if (!result.ok) {
			throw new SafeForClientError(result.error.message)
		}
		return result.data
	})
