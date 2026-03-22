import type { Database } from "@aja-app/supabase"
import {
	companySizeSchema,
	companyStageSchema,
	type TCompany,
	type TCreateCompany,
	type TMarshalledCompany,
	type TUpdateCompany,
} from "./company-schema"

type CompanyInsert = Database["app"]["Tables"]["company"]["Insert"]
type CompanyUpdate = Database["app"]["Tables"]["company"]["Update"]

export function unmarshalCompany(m: TMarshalledCompany): TCompany {
	return {
		id: m.id,
		name: m.name,
		website: m.website,
		linkedinUrl: m.linkedin_url,
		size: m.size ? companySizeSchema.parse(m.size) : null,
		stage: m.stage ? companyStageSchema.parse(m.stage) : null,
		industry: m.industry,
		notes: m.notes,
		createdAt: m.created_at,
		updatedAt: m.updated_at,
	}
}

export function marshalCreateCompany(input: TCreateCompany): CompanyInsert {
	return {
		name: input.name,
		website: input.website ?? null,
		linkedin_url: input.linkedinUrl ?? null,
		size: input.size ?? null,
		stage: input.stage ?? null,
		industry: input.industry ?? null,
		notes: input.notes ?? null,
	}
}

export function marshalUpdateCompany(input: TUpdateCompany): CompanyUpdate {
	const updates: CompanyUpdate = {}
	if (input.name !== undefined) updates.name = input.name
	if (input.website !== undefined) updates.website = input.website
	if (input.linkedinUrl !== undefined)
		updates.linkedin_url = input.linkedinUrl
	if (input.size !== undefined) updates.size = input.size
	if (input.stage !== undefined) updates.stage = input.stage
	if (input.industry !== undefined) updates.industry = input.industry
	if (input.notes !== undefined) updates.notes = input.notes
	return updates
}
