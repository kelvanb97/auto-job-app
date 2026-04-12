import type Anthropic from "@anthropic-ai/sdk"
import type OpenAI from "openai"
import { z } from "zod"

export type { TLlmConfig, TNewLlmConfig } from "@rja-app/drizzle"

export const LLM_PROVIDERS = ["anthropic", "openai"] as const
export type TLlmProvider = (typeof LLM_PROVIDERS)[number]
export const llmProviderSchema = z.enum(LLM_PROVIDERS)

// Anthropic's `Messages.Model` is intentionally an open union — it includes
// `(string & {})` so the SDK accepts new model names without a type-level
// breaking change. That open branch defeats the point of using the SDK type
// for compile-time validation, so narrow it back to just the literal members.
type ExtractStringLiterals<T> = T extends string
	? string extends T
		? never
		: T
	: never

export type TAnthropicModel = ExtractStringLiterals<Anthropic.Messages.Model>
export type TOpenAiModel = OpenAI.ChatModel

export const LLM_USE_CASES = [
	"scoring",
	"keyword",
	"resume",
	"coverLetter",
] as const
export type TLlmUseCase = (typeof LLM_USE_CASES)[number]

export const upsertLlmConfigSchema = z.object({
	anthropicApiKey: z.string().default(""),
	openaiApiKey: z.string().default(""),
	scoringProvider: llmProviderSchema,
	scoringModel: z.string().min(1),
	keywordProvider: llmProviderSchema,
	keywordModel: z.string().min(1),
	resumeProvider: llmProviderSchema,
	resumeModel: z.string().min(1),
	coverLetterProvider: llmProviderSchema,
	coverLetterModel: z.string().min(1),
})

export type TUpsertLlmConfig = z.infer<typeof upsertLlmConfigSchema>

export type TResolvedLlmConfig = {
	provider: TLlmProvider
	apiKey: string
	model: string
}
