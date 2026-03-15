import type { TPerson, TMarshalledPerson } from "./person-schema"

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

export function marshalPerson(
	p: Omit<TPerson, "id" | "createdAt" | "updatedAt">,
): Omit<TMarshalledPerson, "id" | "created_at" | "updated_at"> {
	return {
		company_id: p.companyId,
		name: p.name,
		title: p.title,
		email: p.email,
		linkedin_url: p.linkedinUrl,
		notes: p.notes,
	}
}
