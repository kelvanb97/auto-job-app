import { getLlmConfigForUseCase } from "@rja-api/settings/api/get-llm-config-for-use-case"
import { createMessage } from "@rja-integrations/llm/client"
import { z } from "zod"

const scoreResponseSchema = z.object({
	score: z.number().min(0).max(100),
	isTitleFit: z.boolean(),
	isSeniorityAppropriate: z.boolean(),
	doSkillsAlign: z.boolean(),
	isLocationAcceptable: z.boolean(),
	isSalaryAcceptable: z.boolean(),
	positive: z.array(z.string()),
	negative: z.array(z.string()),
})

export type TScoreResponse = z.infer<typeof scoreResponseSchema>

export async function scoreRole(
	system: string,
	user: string,
): Promise<TScoreResponse> {
	const configResult = getLlmConfigForUseCase("scoring")
	if (!configResult.ok) throw configResult.error
	return createMessage(configResult.data, {
		system,
		user,
		schema: scoreResponseSchema,
	})
}
