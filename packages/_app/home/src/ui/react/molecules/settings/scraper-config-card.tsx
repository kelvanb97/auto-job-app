"use client"

import type { TScraperConfig } from "@rja-api/settings/schema/scraper-config-schema"
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
import { InputLabelWrapper } from "@rja-design/ui/library/input-label-wrapper"
import { Label } from "@rja-design/ui/library/label"
import { MultiInput } from "@rja-design/ui/library/multi-input"
import { toast } from "@rja-design/ui/library/toast"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import { updateScraperConfigAction } from "#actions/settings-actions"
import type { Dispatch, SetStateAction } from "react"

const BLANK_SCRAPER: TScraperConfig = {
	id: 0,
	userProfileId: 0,
	relevantKeywords: [],
	blockedKeywords: [],
	blockedCompanies: [],
	enabledSources: [],
	googleTitles: [],
	googleRemote: true,
	googleFullTimeOnly: true,
	googleFreshnessDays: 3,
	googleMaxPages: 5,
	linkedinUrls: [],
	linkedinMaxPages: 5,
	linkedinMaxPerPage: 25,
	createdAt: null,
	updatedAt: null,
}

interface IScraperConfigCardProps {
	profileId: number
	scraper: TScraperConfig | null
	setScraper: Dispatch<SetStateAction<TScraperConfig | null>>
}

export function ScraperConfigCard({
	profileId,
	scraper,
	setScraper,
}: IScraperConfigCardProps) {
	const update = (field: keyof TScraperConfig, value: unknown) => {
		setScraper(
			(prev) =>
				({
					...(prev ?? {
						...BLANK_SCRAPER,
						userProfileId: profileId,
					}),
					[field]: value,
				}) as TScraperConfig,
		)
	}

	const { execute, result, status } = useAction(updateScraperConfigAction, {
		onSuccess: ({ data }) => {
			if (data) {
				toast.success("Saved!")
				setScraper(data)
			}
		},
	})
	const error = useActionError(result)
	useToastOnError(error, status)
	const isLoading = useIsLoading(status)

	const handleSave = () => {
		execute({
			userProfileId: profileId,
			relevantKeywords: scraper?.relevantKeywords ?? [],
			blockedKeywords: scraper?.blockedKeywords ?? [],
			blockedCompanies: scraper?.blockedCompanies ?? [],
			enabledSources: scraper?.enabledSources ?? [],
			linkedinUrls: scraper?.linkedinUrls ?? [],
			linkedinMaxPages: scraper?.linkedinMaxPages ?? 5,
			linkedinMaxPerPage: scraper?.linkedinMaxPerPage ?? 25,
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Scraper Configuration</CardTitle>
				<CardDescription>
					Keywords and filters for job scraping.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<YStack className="gap-4">
					<InputLabelWrapper>
						<Label>Relevant Keywords</Label>
						<MultiInput
							values={scraper?.relevantKeywords ?? []}
							onChange={(vals) =>
								update("relevantKeywords", vals)
							}
							max={50}
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label>Blocked Keywords</Label>
						<MultiInput
							values={scraper?.blockedKeywords ?? []}
							onChange={(vals) => update("blockedKeywords", vals)}
							max={50}
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label>Blocked Companies</Label>
						<MultiInput
							values={scraper?.blockedCompanies ?? []}
							onChange={(vals) =>
								update("blockedCompanies", vals)
							}
							max={50}
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label>Enabled Sources</Label>
						<MultiInput
							values={scraper?.enabledSources ?? []}
							onChange={(vals) => update("enabledSources", vals)}
							max={10}
						/>
					</InputLabelWrapper>
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
