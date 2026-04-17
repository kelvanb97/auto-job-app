"use client"

import { Download, X } from "@rja-design/ui/assets/lucide"
import { XStack } from "@rja-design/ui/primitives/x-stack"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import { useEffect, useState } from "react"

interface IVersionOutdatedBannerClientProps {
	latestSha: string
}

const storageKey = (sha: string) => `rj-version-banner-dismissed-${sha}`

export function VersionOutdatedBannerClient({
	latestSha,
}: IVersionOutdatedBannerClientProps) {
	const [dismissed, setDismissed] = useState(true)

	useEffect(() => {
		try {
			const stored = window.sessionStorage.getItem(storageKey(latestSha))
			setDismissed(stored === "1")
		} catch {
			setDismissed(false)
		}
	}, [latestSha])

	const handleDismiss = () => {
		try {
			window.sessionStorage.setItem(storageKey(latestSha), "1")
		} catch {
			// sessionStorage unavailable — dismiss is best-effort
		}
		setDismissed(true)
	}

	if (dismissed) return null

	return (
		<XStack className="items-center justify-between gap-4 border-b border-border bg-muted/30 px-6 py-3">
			<XStack className="items-center gap-3">
				<Download className="size-5 text-primary" />
				<YStack className="gap-0.5">
					<span className="text-sm font-medium">
						A newer version of Rocket Jobs is available
					</span>
					<span className="text-xs text-muted-foreground">
						Run{" "}
						<code className="font-mono text-xs text-primary">
							/rj-update
						</code>{" "}
						in your AI assistant (Claude Code or Codex) to pull the
						latest code, reinstall dependencies, and apply
						migrations.
					</span>
				</YStack>
			</XStack>
			<button
				type="button"
				onClick={handleDismiss}
				className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
				aria-label="Dismiss update banner"
			>
				<X className="size-3.5" />
				Dismiss
			</button>
		</XStack>
	)
}
