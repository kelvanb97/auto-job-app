"use client"

import { CopyPrompt } from "@rja-design/ui/library/copy-prompt"
import { TextBody } from "@rja-design/ui/library/text"
import { YStack } from "@rja-design/ui/primitives/y-stack"

export function OperationsTemplate() {
	return (
		<YStack className="gap-8">
			{/* Scrape Section */}
			<YStack className="gap-4">
				<TextBody
					size="lg"
					variant="foreground"
					className="font-semibold"
				>
					Scrape Jobs
				</TextBody>
				<CopyPrompt value="/scrape" />
				<TextBody size="sm" variant="muted-foreground">
					Or run directly via CLI:{" "}
					<code className="rounded bg-muted px-1.5 py-0.5 text-xs">
						pnpm --filter @rja-app/scraper run scrape linkedin
					</code>
				</TextBody>
			</YStack>

			{/* Score Section */}
			<YStack className="gap-4">
				<TextBody
					size="lg"
					variant="foreground"
					className="font-semibold"
				>
					Score Roles
				</TextBody>
				<CopyPrompt value="/score-role" />
			</YStack>
		</YStack>
	)
}
