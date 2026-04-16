"use client"

import type { TLlmConfig } from "@rja-api/settings/schema/llm-config-schema"
import { TextBody } from "@rja-design/ui/library/text"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import { LlmConfigCard } from "#molecules/settings/llm-config-card"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

interface ILlmConfigTemplateProps {
	llm: TLlmConfig | null
}

export function LlmConfigTemplate({ llm }: ILlmConfigTemplateProps) {
	const router = useRouter()
	const onSaved = useCallback(() => router.refresh(), [router])

	const configured = !!(llm?.anthropicApiKey || llm?.openaiApiKey)

	return (
		<YStack className="w-full max-w-4xl gap-4 pb-6">
			<YStack className="gap-1">
				<TextBody size="sm" variant="muted-foreground">
					API keys and per-use-case model selection for Anthropic and
					OpenAI. Keys are stored in the local SQLite database and
					used for scoring jobs, generating resumes, generating cover
					letters, and parsing uploaded resumes.
				</TextBody>
				{!configured && (
					<TextBody size="sm" variant="muted-foreground">
						Once you save at least one API key, head to{" "}
						<a href="/settings" className="underline">
							Settings
						</a>{" "}
						to upload your resume and populate your profile.
					</TextBody>
				)}
			</YStack>
			<LlmConfigCard llm={llm} onSaved={onSaved} />
		</YStack>
	)
}
