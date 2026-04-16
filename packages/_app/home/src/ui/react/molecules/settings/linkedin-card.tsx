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
import { Input } from "@rja-design/ui/library/input"
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

interface ILinkedinCardProps {
	profileId: number
	scraper: TScraperConfig | null
	setScraper: Dispatch<SetStateAction<TScraperConfig | null>>
}

export function LinkedInCard({
	profileId,
	scraper,
	setScraper,
}: ILinkedinCardProps) {
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
				<CardTitle>LinkedIn Search</CardTitle>
				<CardDescription>
					Search parameters for LinkedIn scraping.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<YStack className="gap-4">
					<InputLabelWrapper>
						<Label>Search URLs</Label>
						<MultiInput
							values={scraper?.linkedinUrls ?? []}
							onChange={(vals) => update("linkedinUrls", vals)}
							max={30}
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label htmlFor="linkedin-max-pages">Max Pages</Label>
						<Input
							id="linkedin-max-pages"
							type="number"
							value={scraper?.linkedinMaxPages ?? 5}
							onChange={(e) =>
								update(
									"linkedinMaxPages",
									Number(e.target.value),
								)
							}
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label htmlFor="linkedin-max-per-page">
							Max Per Page
						</Label>
						<Input
							id="linkedin-max-per-page"
							type="number"
							value={scraper?.linkedinMaxPerPage ?? 25}
							onChange={(e) =>
								update(
									"linkedinMaxPerPage",
									Number(e.target.value),
								)
							}
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
