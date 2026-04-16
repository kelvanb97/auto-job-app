"use client"

import type { TEeoConfig } from "@rja-api/settings/schema/eeo-config-schema"
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
import { Switch } from "@rja-design/ui/library/switch"
import { toast } from "@rja-design/ui/library/toast"
import { Tooltip } from "@rja-design/ui/library/tooltip"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import { updateEeoAction } from "#actions/settings-actions"
import type { Dispatch, SetStateAction } from "react"

const VETERAN_STATUS_OPTIONS = [
	{
		label: "I am not a protected veteran",
		value: "I am not a protected veteran",
	},
	{ label: "I am a protected veteran", value: "I am a protected veteran" },
	{ label: "Decline to self-identify", value: "Decline to self-identify" },
]

const DISABILITY_STATUS_OPTIONS = [
	{
		label: "No, I don't have a disability",
		value: "No, I don't have a disability",
	},
	{ label: "Yes, I have a disability", value: "Yes, I have a disability" },
	{ label: "Decline to self-identify", value: "Decline to self-identify" },
]

const BLANK_EEO: TEeoConfig = {
	id: 0,
	userProfileId: 0,
	gender: null,
	ethnicity: null,
	veteranStatus: null,
	disabilityStatus: null,
	workAuthorization: null,
	requiresVisaSponsorship: false,
	createdAt: null,
	updatedAt: null,
}

interface IEeoCardProps {
	profileId: number
	eeo: TEeoConfig | null
	setEeo: Dispatch<SetStateAction<TEeoConfig | null>>
}

export function EeoCard({ profileId, eeo, setEeo }: IEeoCardProps) {
	const update = (field: keyof TEeoConfig, value: unknown) => {
		setEeo(
			(prev) =>
				({
					...(prev ?? { ...BLANK_EEO, userProfileId: profileId }),
					[field]: value,
				}) as TEeoConfig,
		)
	}

	const { execute, result, status } = useAction(updateEeoAction, {
		onSuccess: ({ data }) => {
			if (data) {
				toast.success("Saved!")
				setEeo(data)
			}
		},
	})
	const error = useActionError(result)
	useToastOnError(error, status)
	const isLoading = useIsLoading(status)

	const handleSave = () => {
		execute({
			userProfileId: profileId,
			gender: eeo?.gender || null,
			ethnicity: eeo?.ethnicity || null,
			veteranStatus: eeo?.veteranStatus || null,
			disabilityStatus: eeo?.disabilityStatus || null,
			workAuthorization: eeo?.workAuthorization || null,
			requiresVisaSponsorship: eeo?.requiresVisaSponsorship ?? false,
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>EEO & Work Authorization</CardTitle>
				<CardDescription>
					Equal Employment Opportunity and work authorization
					settings.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<YStack className="gap-4">
					<InputLabelWrapper>
						<Label htmlFor="eeo-gender">Gender</Label>
						<Input
							id="eeo-gender"
							value={eeo?.gender ?? ""}
							onChange={(e) => update("gender", e.target.value)}
							placeholder="Leave empty to decline"
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label htmlFor="eeo-ethnicity">Ethnicity</Label>
						<Input
							id="eeo-ethnicity"
							value={eeo?.ethnicity ?? ""}
							onChange={(e) =>
								update("ethnicity", e.target.value)
							}
							placeholder="Leave empty to decline"
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label>Veteran Status</Label>
						<Select
							value={eeo?.veteranStatus || null}
							onValueChange={(val) =>
								update("veteranStatus", val)
							}
							options={VETERAN_STATUS_OPTIONS}
							placeholder="Select veteran status"
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label>Disability Status</Label>
						<Select
							value={eeo?.disabilityStatus || null}
							onValueChange={(val) =>
								update("disabilityStatus", val)
							}
							options={DISABILITY_STATUS_OPTIONS}
							placeholder="Select disability status"
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label htmlFor="eeo-work-authorization">
							Work Authorization
							<Tooltip
								iconClassName="size-3.5 text-muted-foreground"
								content="Country or region where you are authorized to work (e.g. United States, European Union, Canada, United Kingdom)."
							/>
						</Label>
						<Input
							id="eeo-work-authorization"
							value={eeo?.workAuthorization ?? ""}
							onChange={(e) =>
								update("workAuthorization", e.target.value)
							}
							placeholder="e.g. United States"
						/>
					</InputLabelWrapper>

					<Switch
						checked={eeo?.requiresVisaSponsorship ?? false}
						onCheckedChange={(val) =>
							update("requiresVisaSponsorship", val)
						}
						rightLabel="Requires Visa Sponsorship"
					/>
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
