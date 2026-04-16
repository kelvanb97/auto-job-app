"use client"

import type {
	TScoringConfig,
	TScoringWeight,
} from "@rja-api/settings/schema/scoring-config-schema"
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
import { Select } from "@rja-design/ui/library/select"
import { toast } from "@rja-design/ui/library/toast"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import { updateScoringConfigAction } from "#actions/settings-actions"
import type { Dispatch, SetStateAction } from "react"

const WEIGHT_OPTIONS: { label: string; value: TScoringWeight }[] = [
	{ label: "High", value: "high" },
	{ label: "Medium", value: "medium" },
	{ label: "Low", value: "low" },
]

const BLANK_SCORING: TScoringConfig = {
	id: 0,
	userProfileId: 0,
	titleAndSeniority: "high",
	skills: "high",
	salary: "high",
	location: "medium",
	industry: "low",
	createdAt: null,
	updatedAt: null,
}

interface IScoringWeightsCardProps {
	profileId: number
	scoring: TScoringConfig | null
	setScoring: Dispatch<SetStateAction<TScoringConfig | null>>
}

export function ScoringWeightsCard({
	profileId,
	scoring,
	setScoring,
}: IScoringWeightsCardProps) {
	const update = (field: keyof TScoringConfig, value: unknown) => {
		setScoring(
			(prev) =>
				({
					...(prev ?? {
						...BLANK_SCORING,
						userProfileId: profileId,
					}),
					[field]: value,
				}) as TScoringConfig,
		)
	}

	const { execute, result, status } = useAction(updateScoringConfigAction, {
		onSuccess: ({ data }) => {
			if (data) {
				toast.success("Saved!")
				setScoring(data)
			}
		},
	})
	const error = useActionError(result)
	useToastOnError(error, status)
	const isLoading = useIsLoading(status)

	const handleSave = () => {
		execute({
			userProfileId: profileId,
			titleAndSeniority:
				(scoring?.titleAndSeniority as TScoringWeight) ?? "high",
			skills: (scoring?.skills as TScoringWeight) ?? "high",
			salary: (scoring?.salary as TScoringWeight) ?? "high",
			location: (scoring?.location as TScoringWeight) ?? "medium",
			industry: (scoring?.industry as TScoringWeight) ?? "low",
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Scoring Weights</CardTitle>
				<CardDescription>
					Weight configuration for AI role scoring.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<YStack className="gap-4">
					<InputLabelWrapper>
						<Label>Title & Seniority</Label>
						<Select
							value={
								(scoring?.titleAndSeniority as TScoringWeight) ??
								"high"
							}
							onValueChange={(val) =>
								update("titleAndSeniority", val)
							}
							options={WEIGHT_OPTIONS}
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label>Skills</Label>
						<Select
							value={
								(scoring?.skills as TScoringWeight) ?? "high"
							}
							onValueChange={(val) => update("skills", val)}
							options={WEIGHT_OPTIONS}
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label>Salary</Label>
						<Select
							value={
								(scoring?.salary as TScoringWeight) ?? "high"
							}
							onValueChange={(val) => update("salary", val)}
							options={WEIGHT_OPTIONS}
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label>Location</Label>
						<Select
							value={
								(scoring?.location as TScoringWeight) ??
								"medium"
							}
							onValueChange={(val) => update("location", val)}
							options={WEIGHT_OPTIONS}
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label>Industry</Label>
						<Select
							value={
								(scoring?.industry as TScoringWeight) ?? "low"
							}
							onValueChange={(val) => update("industry", val)}
							options={WEIGHT_OPTIONS}
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
