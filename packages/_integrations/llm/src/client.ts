import { createMessage as createAnthropicMessage } from "@rja-integrations/anthropic/client"
import { createMessage as createOpenAiMessage } from "@rja-integrations/openai/client"
import { z } from "zod"

export const LLM_PROVIDERS = ["anthropic", "openai"] as const
export type TLlmProvider = (typeof LLM_PROVIDERS)[number]

export type TLlmConfig = {
	provider: TLlmProvider
	apiKey: string
	model: string
}

export type TCreateMessageParams<T> = {
	system: string
	user: string
	maxTokens?: number
	schema: z.ZodType<T>
}

export async function createMessage<T>(
	config: TLlmConfig,
	params: TCreateMessageParams<T>,
): Promise<T> {
	const shared = {
		apiKey: config.apiKey,
		model: config.model,
		system: params.system,
		user: params.user,
		schema: params.schema,
		...(params.maxTokens !== undefined
			? { maxTokens: params.maxTokens }
			: {}),
	}
	switch (config.provider) {
		case "anthropic":
			return createAnthropicMessage(shared)
		case "openai":
			return createOpenAiMessage(shared)
	}
}
