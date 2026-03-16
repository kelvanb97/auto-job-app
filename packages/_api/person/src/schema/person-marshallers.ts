import type { Database } from "@aja-app/supabase"
import type {
	TCreatePerson,
	TMarshalledPerson,
	TPerson,
	TUpdatePerson,
} from "./person-schema"

type PersonInsert = Database["app"]["Tables"]["person"]["Insert"]
type PersonUpdate = Database["app"]["Tables"]["person"]["Update"]

export function unmarshalPerson(m: TMarshalledPerson): TPerson {
	return {
		id: m.id,
		companyId: m.company_id,
		name: m.name,
		title: m.title,
		email: m.email,
		linkedinUrl: m.linkedin_url,
		notes: m.notes,
		createdAt: m.created_at,
		updatedAt: m.updated_at,
	}
}

export function marshalCreatePerson(input: TCreatePerson): PersonInsert {
	return {
		company_id: input.companyId ?? null,
		name: input.name,
		title: input.title ?? null,
		email: input.email ?? null,
		linkedin_url: input.linkedinUrl ?? null,
		notes: input.notes ?? null,
	}
}

export function marshalUpdatePerson(input: TUpdatePerson): PersonUpdate {
	const updates: PersonUpdate = {}
	if (input.companyId !== undefined) updates.company_id = input.companyId
	if (input.name !== undefined) updates.name = input.name
	if (input.title !== undefined) updates.title = input.title
	if (input.email !== undefined) updates.email = input.email
	if (input.linkedinUrl !== undefined)
		updates.linkedin_url = input.linkedinUrl
	if (input.notes !== undefined) updates.notes = input.notes
	return updates
}
