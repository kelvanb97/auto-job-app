import { errFrom, ok, type TResult } from "@rja-core/result"
import {
	llmProviderSchema,
	type TLlmUseCase,
	type TResolvedLlmConfig,
} from "#schema/llm-config-schema"
import { getLlmConfig } from "./get-llm-config"

export function getLlmConfigForUseCase(
	useCase: TLlmUseCase,
): TResult<TResolvedLlmConfig> {
	const result = getLlmConfig()
	if (!result.ok) return result
	if (!result.data) {
		return errFrom(
			"LLM config not set — configure providers and API keys in /settings",
		)
	}

	const cfg = result.data
	const providerField = `${useCase}Provider` as const
	const modelField = `${useCase}Model` as const

	const providerParse = llmProviderSchema.safeParse(cfg[providerField])
	if (!providerParse.success) {
		return errFrom(`Invalid provider for ${useCase}: ${cfg[providerField]}`)
	}
	const provider = providerParse.data
	const model = cfg[modelField]

	const apiKey =
		provider === "anthropic" ? cfg.anthropicApiKey : cfg.openaiApiKey
	if (!apiKey) {
		return errFrom(
			`No ${provider} API key configured — add one in /settings`,
		)
	}

	return ok({ provider, apiKey, model })
}
