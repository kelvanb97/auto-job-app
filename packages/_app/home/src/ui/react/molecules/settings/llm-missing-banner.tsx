import { Sparkles } from "@rja-design/ui/assets/lucide"
import { XStack } from "@rja-design/ui/primitives/x-stack"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import Link from "next/link"

export function LlmMissingBanner() {
	return (
		<XStack className="items-center justify-between gap-4 border-b border-border bg-muted/30 px-6 py-3">
			<XStack className="items-center gap-3">
				<Sparkles className="size-5 text-primary" />
				<YStack className="gap-0.5">
					<span className="text-sm font-medium">
						Configure an LLM provider to unlock resume import
					</span>
					<span className="text-xs text-muted-foreground">
						Resume extraction uses Claude or GPT to parse PDFs and
						DOCX files into profile data.
					</span>
				</YStack>
			</XStack>
			<Link
				href="/llm-config"
				className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			>
				Open LLM Config
			</Link>
		</XStack>
	)
}
