import type { TRolePerson, TMarshalledRolePerson } from "./role-person-schema"

export function unmarshalRolePerson(m: TMarshalledRolePerson): TRolePerson {
	return {
		roleId: m.role_id,
		personId: m.person_id,
		relationship: m.relationship,
	}
}
