import type { TScore, TMarshalledScore } from "./score-schema"

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
