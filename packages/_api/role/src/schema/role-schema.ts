import { z } from "zod"
import type { Database } from "@aja-app/supabase"

export type TRole = {
	id: string
	companyId: string | null
	title: string
	url: string | null
	description: string | null
	source: string | null
	locationType: string | null
	location: string | null
	salaryMin: number | null
	salaryMax: number | null
	status: string
	postedAt: string | null
	notes: string | null
	createdAt: string | null
	updatedAt: string | null
}

export type TMarshalledRole = Database["app"]["Tables"]["role"]["Row"]

export const getRoleSchema = z.object({
	id: z.string(),
})

export const listRolesSchema = z.object({
	page: z.number().min(1).default(1),
	pageSize: z.number().min(1).max(100).default(25),
	search: z.string().optional(),
	companyId: z.string().optional(),
	status: z.string().optional(),
	locationType: z.string().optional(),
	source: z.string().optional(),
})

export type TListRoles = z.infer<typeof listRolesSchema>

export const createRoleSchema = z.object({
	companyId: z.string().nullable().optional(),
	title: z.string().min(1),
	url: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	source: z.string().nullable().optional(),
	locationType: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
	salaryMin: z.number().nullable().optional(),
	salaryMax: z.number().nullable().optional(),
	status: z.string().optional(),
	postedAt: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
})

export type TCreateRole = z.infer<typeof createRoleSchema>

export const updateRoleSchema = z.object({
	id: z.string(),
	companyId: z.string().nullable().optional(),
	title: z.string().min(1).optional(),
	url: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	source: z.string().nullable().optional(),
	locationType: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
	salaryMin: z.number().nullable().optional(),
	salaryMax: z.number().nullable().optional(),
	status: z.string().optional(),
	postedAt: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
})

export type TUpdateRole = z.infer<typeof updateRoleSchema>

export const deleteRoleSchema = z.object({
	id: z.string(),
})
