"use client"

import type {
	TAnthropicModel,
	TLlmConfig,
	TOpenAiModel,
} from "@rja-api/settings/schema/llm-config-schema"
import {
	LLM_PROVIDERS,
	type TLlmProvider,
} from "@rja-api/settings/schema/llm-config-schema"
import {
	useAction,
	useActionError,
	useIsLoading,
	useToastOnError,
} from "@rja-core/next-safe-action/hooks"
import { Button } from "@rja-design/ui/library/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@rja-design/ui/library/card"
import { Input } from "@rja-design/ui/library/input"
import { InputLabelWrapper } from "@rja-design/ui/library/input-label-wrapper"
import { Label } from "@rja-design/ui/library/label"
import { Select } from "@rja-design/ui/library/select"
import { toast } from "@rja-design/ui/library/toast"
import { XStack } from "@rja-design/ui/primitives/x-stack"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import { updateLlmConfigAction } from "#actions/settings-actions"
import { useState } from "react"

const PROVIDER_OPTIONS: { label: string; value: TLlmProvider }[] =
	LLM_PROVIDERS.map((p) => ({
		label: p === "anthropic" ? "Anthropic" : "OpenAI",
		value: p,
	}))

const ANTHROPIC_MODELS = [
	"claude-opus-4-6",
	"claude-sonnet-4-6",
	"claude-haiku-4-5",
] as const satisfies readonly TAnthropicModel[]

const OPENAI_MODELS = [
	"gpt-5.4",
	"gpt-5.4-mini",
	"gpt-5.4-nano",
	"gpt-5",
	"gpt-5-mini",
	"gpt-5-nano",
	"gpt-4.1",
	"gpt-4.1-mini",
	"gpt-4.1-nano",
	"gpt-4o",
	"gpt-4o-mini",
	"o4-mini",
	"o3",
	"o3-mini",
] as const satisfies readonly TOpenAiModel[]

function getCuratedModels(provider: TLlmProvider): readonly string[] {
	return provider === "anthropic" ? ANTHROPIC_MODELS : OPENAI_MODELS
}

function modelOptions(
	provider: TLlmProvider,
	current: string,
): { label: string; value: string }[] {
	const curated = getCuratedModels(provider)
	const all = curated.includes(current) ? curated : [current, ...curated]
	return all.map((m) => ({ label: m, value: m }))
}

const DEFAULT_SCORING_PROVIDER: TLlmProvider = "anthropic"
const DEFAULT_SCORING_MODEL = "claude-haiku-4-5"
const DEFAULT_KEYWORD_PROVIDER: TLlmProvider = "anthropic"
const DEFAULT_KEYWORD_MODEL = "claude-haiku-4-5"
const DEFAULT_RESUME_PROVIDER: TLlmProvider = "anthropic"
const DEFAULT_RESUME_MODEL = "claude-opus-4-6"
const DEFAULT_COVER_LETTER_PROVIDER: TLlmProvider = "anthropic"
const DEFAULT_COVER_LETTER_MODEL = "claude-opus-4-6"

interface ILlmConfigCardProps {
	profileId: number
	llm: TLlmConfig | null
	onSaved: () => void
}

export function LlmConfigCard({
	profileId,
	llm,
	onSaved,
}: ILlmConfigCardProps) {
	const [anthropicApiKey, setAnthropicApiKey] = useState(
		llm?.anthropicApiKey ?? "",
	)
	const [openaiApiKey, setOpenaiApiKey] = useState(llm?.openaiApiKey ?? "")

	const [scoringProvider, setScoringProvider] = useState<TLlmProvider>(
		(llm?.scoringProvider as TLlmProvider) ?? DEFAULT_SCORING_PROVIDER,
	)
	const [scoringModel, setScoringModel] = useState(
		llm?.scoringModel ?? DEFAULT_SCORING_MODEL,
	)

	const [keywordProvider, setKeywordProvider] = useState<TLlmProvider>(
		(llm?.keywordProvider as TLlmProvider) ?? DEFAULT_KEYWORD_PROVIDER,
	)
	const [keywordModel, setKeywordModel] = useState(
		llm?.keywordModel ?? DEFAULT_KEYWORD_MODEL,
	)

	const [resumeProvider, setResumeProvider] = useState<TLlmProvider>(
		(llm?.resumeProvider as TLlmProvider) ?? DEFAULT_RESUME_PROVIDER,
	)
	const [resumeModel, setResumeModel] = useState(
		llm?.resumeModel ?? DEFAULT_RESUME_MODEL,
	)

	const [coverLetterProvider, setCoverLetterProvider] =
		useState<TLlmProvider>(
			(llm?.coverLetterProvider as TLlmProvider) ??
				DEFAULT_COVER_LETTER_PROVIDER,
		)
	const [coverLetterModel, setCoverLetterModel] = useState(
		llm?.coverLetterModel ?? DEFAULT_COVER_LETTER_MODEL,
	)

	const handleScoringProviderChange = (next: TLlmProvider) => {
		setScoringProvider(next)
		const curated = getCuratedModels(next)
		if (!curated.includes(scoringModel)) {
			setScoringModel(curated[0]!)
		}
	}

	const handleKeywordProviderChange = (next: TLlmProvider) => {
		setKeywordProvider(next)
		const curated = getCuratedModels(next)
		if (!curated.includes(keywordModel)) {
			setKeywordModel(curated[0]!)
		}
	}

	const handleResumeProviderChange = (next: TLlmProvider) => {
		setResumeProvider(next)
		const curated = getCuratedModels(next)
		if (!curated.includes(resumeModel)) {
			setResumeModel(curated[0]!)
		}
	}

	const handleCoverLetterProviderChange = (next: TLlmProvider) => {
		setCoverLetterProvider(next)
		const curated = getCuratedModels(next)
		if (!curated.includes(coverLetterModel)) {
			setCoverLetterModel(curated[0]!)
		}
	}

	const { execute, result, status } = useAction(updateLlmConfigAction, {
		onSuccess: () => {
			toast.success("Saved!")
			onSaved()
		},
	})
	const error = useActionError(result)
	useToastOnError(error, status)
	const isLoading = useIsLoading(status)

	const handleSave = () => {
		execute({
			userProfileId: profileId,
			anthropicApiKey,
			openaiApiKey,
			scoringProvider,
			scoringModel,
			keywordProvider,
			keywordModel,
			resumeProvider,
			resumeModel,
			coverLetterProvider,
			coverLetterModel,
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>LLM Provider</CardTitle>
				<CardDescription>
					API keys and per-use-case model selection for Anthropic and
					OpenAI. Keys are stored in the local SQLite database.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<YStack className="gap-6">
					<YStack className="gap-4">
						<div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
							API Keys
						</div>
						<InputLabelWrapper>
							<Label htmlFor="llm-anthropic-api-key">
								Anthropic API Key
							</Label>
							<Input
								id="llm-anthropic-api-key"
								type="password"
								autoComplete="off"
								value={anthropicApiKey}
								onChange={(e) =>
									setAnthropicApiKey(e.target.value)
								}
								placeholder="sk-ant-..."
							/>
						</InputLabelWrapper>
						<InputLabelWrapper>
							<Label htmlFor="llm-openai-api-key">
								OpenAI API Key
							</Label>
							<Input
								id="llm-openai-api-key"
								type="password"
								autoComplete="off"
								value={openaiApiKey}
								onChange={(e) =>
									setOpenaiApiKey(e.target.value)
								}
								placeholder="sk-..."
							/>
						</InputLabelWrapper>
					</YStack>

					<YStack className="gap-4">
						<div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
							Scoring
						</div>
						<XStack className="gap-4">
							<InputLabelWrapper className="flex-1">
								<Label>Provider</Label>
								<Select
									value={scoringProvider}
									onValueChange={handleScoringProviderChange}
									options={PROVIDER_OPTIONS}
								/>
							</InputLabelWrapper>
							<InputLabelWrapper className="flex-1">
								<Label>Model</Label>
								<Select
									value={scoringModel}
									onValueChange={setScoringModel}
									options={modelOptions(
										scoringProvider,
										scoringModel,
									)}
								/>
							</InputLabelWrapper>
						</XStack>
					</YStack>

					<YStack className="gap-4">
						<div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
							Keyword Extraction
						</div>
						<XStack className="gap-4">
							<InputLabelWrapper className="flex-1">
								<Label>Provider</Label>
								<Select
									value={keywordProvider}
									onValueChange={handleKeywordProviderChange}
									options={PROVIDER_OPTIONS}
								/>
							</InputLabelWrapper>
							<InputLabelWrapper className="flex-1">
								<Label>Model</Label>
								<Select
									value={keywordModel}
									onValueChange={setKeywordModel}
									options={modelOptions(
										keywordProvider,
										keywordModel,
									)}
								/>
							</InputLabelWrapper>
						</XStack>
					</YStack>

					<YStack className="gap-4">
						<div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
							Resume Generation
						</div>
						<XStack className="gap-4">
							<InputLabelWrapper className="flex-1">
								<Label>Provider</Label>
								<Select
									value={resumeProvider}
									onValueChange={handleResumeProviderChange}
									options={PROVIDER_OPTIONS}
								/>
							</InputLabelWrapper>
							<InputLabelWrapper className="flex-1">
								<Label>Model</Label>
								<Select
									value={resumeModel}
									onValueChange={setResumeModel}
									options={modelOptions(
										resumeProvider,
										resumeModel,
									)}
								/>
							</InputLabelWrapper>
						</XStack>
					</YStack>

					<YStack className="gap-4">
						<div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
							Cover Letter Generation
						</div>
						<XStack className="gap-4">
							<InputLabelWrapper className="flex-1">
								<Label>Provider</Label>
								<Select
									value={coverLetterProvider}
									onValueChange={
										handleCoverLetterProviderChange
									}
									options={PROVIDER_OPTIONS}
								/>
							</InputLabelWrapper>
							<InputLabelWrapper className="flex-1">
								<Label>Model</Label>
								<Select
									value={coverLetterModel}
									onValueChange={setCoverLetterModel}
									options={modelOptions(
										coverLetterProvider,
										coverLetterModel,
									)}
								/>
							</InputLabelWrapper>
						</XStack>
					</YStack>
				</YStack>
			</CardContent>
			<CardFooter>
				<Button onClick={handleSave} disabled={isLoading}>
					{isLoading ? "Saving..." : "Save"}
				</Button>
			</CardFooter>
		</Card>
	)
}
