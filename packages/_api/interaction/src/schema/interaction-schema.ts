import type { Database } from "@aja-app/supabase"
import { z } from "zod"

export const INTERACTION_TYPES = [
	"Email",
	"Call",
	"Interview",
	"LinkedIn Touch",
	"Note",
	"Other",
] as const

export type TInteractionType = (typeof INTERACTION_TYPES)[number]

export const interactionTypeSchema = z.enum(INTERACTION_TYPES)

export type TInteraction = {
	id: string
	roleId: string | null
	personId: string | null
	type: TInteractionType
	notes: string | null
	createdAt: string | null
	updatedAt: string | null
}

export type TMarshalledInteraction =
	Database["app"]["Tables"]["interaction"]["Row"]

export const getInteractionSchema = z.object({
	id: z.string(),
})

export const listInteractionsSchema = z.object({
	page: z.number().min(1).default(1),
	pageSize: z.number().min(1).max(100).default(25),
	roleId: z.string().optional(),
	personId: z.string().optional(),
	type: interactionTypeSchema.optional(),
})

export type TListInteractions = z.infer<typeof listInteractionsSchema>

export const createInteractionSchema = z.object({
	roleId: z.string().nullable().optional(),
	personId: z.string().nullable().optional(),
	type: interactionTypeSchema,
	notes: z.string().nullable().optional(),
})

export type TCreateInteraction = z.infer<typeof createInteractionSchema>

export const updateInteractionSchema = z.object({
	id: z.string(),
	roleId: z.string().nullable().optional(),
	personId: z.string().nullable().optional(),
	type: interactionTypeSchema.optional(),
	notes: z.string().nullable().optional(),
})

export type TUpdateInteraction = z.infer<typeof updateInteractionSchema>

export const deleteInteractionSchema = z.object({
	id: z.string(),
})
