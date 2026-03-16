import type { Database } from "@aja-app/supabase"
import type {
	TLinkRolePerson,
	TMarshalledRolePerson,
	TRolePerson,
	TUpdateRolePerson,
} from "./role-person-schema"

type RolePersonInsert = Database["app"]["Tables"]["role_person"]["Insert"]
type RolePersonUpdate = Database["app"]["Tables"]["role_person"]["Update"]

export function unmarshalRolePerson(m: TMarshalledRolePerson): TRolePerson {
	return {
		roleId: m.role_id,
		personId: m.person_id,
		relationship: m.relationship,
	}
}

export function marshalLinkRolePerson(
	input: TLinkRolePerson,
): RolePersonInsert {
	return {
		role_id: input.roleId,
		person_id: input.personId,
		relationship: input.relationship ?? null,
	}
}

export function marshalUpdateRolePerson(
	input: TUpdateRolePerson,
): RolePersonUpdate {
	return {
		relationship: input.relationship,
	}
}
