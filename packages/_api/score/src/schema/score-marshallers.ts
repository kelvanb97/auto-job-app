import type { Database } from "@aja-app/supabase"
import type { TMarshalledScore, TScore, TUpsertScore } from "./score-schema"

type ScoreInsert = Database["app"]["Tables"]["score"]["Insert"]

export function unmarshalScore(m: TMarshalledScore): TScore {
	return {
		id: m.id,
		roleId: m.role_id,
		score: m.score,
		positive: m.positive,
		negative: m.negative,
		createdAt: m.created_at,
		updatedAt: m.updated_at,
	}
}

export function marshalUpsertScore(input: TUpsertScore): ScoreInsert {
	return {
		role_id: input.roleId,
		score: input.score,
		positive: input.positive ?? null,
		negative: input.negative ?? null,
	}
}
