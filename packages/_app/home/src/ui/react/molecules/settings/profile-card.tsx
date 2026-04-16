"use client"

import {
	LOCATION_TYPES,
	type TLocationType,
	type TSeniority,
	type TUserProfileFull,
} from "@rja-api/settings/schema/user-profile-schema"
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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@rja-design/ui/library/input-group"
import { InputLabelWrapper } from "@rja-design/ui/library/input-label-wrapper"
import { Label } from "@rja-design/ui/library/label"
import { MultiInput } from "@rja-design/ui/library/multi-input"
import { MultiSelect } from "@rja-design/ui/library/multi-select"
import { Select } from "@rja-design/ui/library/select"
import { Textarea } from "@rja-design/ui/library/text-area"
import { toast } from "@rja-design/ui/library/toast"
import { Tooltip } from "@rja-design/ui/library/tooltip"
import { XStack } from "@rja-design/ui/primitives/x-stack"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import { updateProfileAction } from "#actions/settings-actions"
import type { Dispatch, SetStateAction } from "react"

function formatCurrency(value: number): string {
	if (!value) return ""
	return value.toLocaleString("en-US")
}

function parseCurrency(formatted: string): number {
	const digits = formatted.replace(/\D/g, "")
	return digits ? Number(digits) : 0
}

const SENIORITY_OPTIONS = [
	{ label: "Junior", value: "junior" },
	{ label: "Mid", value: "mid" },
	{ label: "Senior", value: "senior" },
	{ label: "Staff", value: "staff" },
	{ label: "Principal", value: "principal" },
	{ label: "Director", value: "director" },
]

const YEARS_OF_EXPERIENCE_OPTIONS = Array.from({ length: 51 }, (_, i) => ({
	label: i === 50 ? "50+ years" : i === 1 ? "1 year" : `${i} years`,
	value: String(i),
}))

const LOCATION_TYPE_LABELS: Record<TLocationType, string> = {
	remote: "Remote",
	hybrid: "Hybrid",
	"on-site": "On-site",
}

const LOCATION_TYPE_OPTIONS = LOCATION_TYPES.map((value) => ({
	label: LOCATION_TYPE_LABELS[value],
	value,
}))

interface IProfileCardProps {
	profile: TUserProfileFull | null
	setProfile: Dispatch<SetStateAction<TUserProfileFull | null>>
}

export function ProfileCard({ profile, setProfile }: IProfileCardProps) {
	const update = <K extends keyof TUserProfileFull>(
		field: K,
		value: TUserProfileFull[K],
	) => {
		setProfile((prev) => (prev ? { ...prev, [field]: value } : null))
	}

	const { execute, result, status } = useAction(updateProfileAction, {
		onSuccess: ({ data }) => {
			if (data) {
				toast.success("Profile saved!")
				setProfile((prev) =>
					prev
						? {
								...prev,
								...data,
								preferredLocationTypes:
									data.preferredLocationTypes as TLocationType[],
							}
						: null,
				)
			}
		},
	})
	const error = useActionError(result)
	useToastOnError(error, status)
	const isLoading = useIsLoading(status)

	const handleSave = () => {
		execute({
			id: profile?.id,
			name: profile?.name ?? "",
			email: profile?.email ?? "",
			phone: profile?.phone ?? "",
			links: profile?.links ?? [],
			location: profile?.location ?? "",
			address: profile?.address ?? "",
			jobTitle: profile?.jobTitle ?? "",
			seniority: (profile?.seniority as TSeniority) ?? "mid",
			yearsOfExperience: profile?.yearsOfExperience ?? 0,
			summary: profile?.summary ?? "",
			skills: profile?.skills ?? [],
			domainExpertise: profile?.domainExpertise ?? [],
			preferredLocationTypes:
				(profile?.preferredLocationTypes as TLocationType[]) ?? [],
			preferredLocations: profile?.preferredLocations ?? [],
			salaryMin: profile?.salaryMin ?? 0,
			salaryMax: profile?.salaryMax ?? 0,
			desiredSalary: profile?.desiredSalary ?? 0,
			startDateWeeksOut: profile?.startDateWeeksOut ?? 2,
			industries: profile?.industries ?? [],
			dealbreakers: profile?.dealbreakers ?? [],
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile</CardTitle>
				<CardDescription>
					Your personal and professional information used for
					applications.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<YStack className="gap-6">
					<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
						Contact Info
					</h3>
					<XStack className="gap-4">
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-name">Name</Label>
							<Input
								id="profile-name"
								value={profile?.name ?? ""}
								onChange={(e) => update("name", e.target.value)}
							/>
						</InputLabelWrapper>
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-email">Email</Label>
							<Input
								id="profile-email"
								value={profile?.email ?? ""}
								onChange={(e) =>
									update("email", e.target.value)
								}
							/>
						</InputLabelWrapper>
					</XStack>
					<XStack className="gap-4">
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-phone">Phone</Label>
							<Input
								id="profile-phone"
								value={profile?.phone ?? ""}
								onChange={(e) =>
									update("phone", e.target.value)
								}
							/>
						</InputLabelWrapper>
					</XStack>
					<InputLabelWrapper>
						<Label>Links</Label>
						<MultiInput
							values={profile?.links ?? []}
							onChange={(vals) => update("links", vals)}
							max={10}
							placeholder="https://linkedin.com/in/..., https://github.com/..., etc."
						/>
					</InputLabelWrapper>
					<XStack className="gap-4">
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-location">Location</Label>
							<Input
								id="profile-location"
								value={profile?.location ?? ""}
								onChange={(e) =>
									update("location", e.target.value)
								}
							/>
						</InputLabelWrapper>
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-address">Address</Label>
							<Input
								id="profile-address"
								value={profile?.address ?? ""}
								onChange={(e) =>
									update("address", e.target.value)
								}
							/>
						</InputLabelWrapper>
					</XStack>

					<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
						Career
					</h3>
					<XStack className="gap-4">
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-job-title">Job Title</Label>
							<Input
								id="profile-job-title"
								value={profile?.jobTitle ?? ""}
								onChange={(e) =>
									update("jobTitle", e.target.value)
								}
							/>
						</InputLabelWrapper>
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-seniority">Seniority</Label>
							<Select
								value={
									(profile?.seniority as TSeniority) || null
								}
								onValueChange={(val) =>
									update("seniority", val as TSeniority)
								}
								options={SENIORITY_OPTIONS}
								placeholder="Select seniority"
							/>
						</InputLabelWrapper>
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-yoe">
								Years of Experience
							</Label>
							<Select
								value={String(profile?.yearsOfExperience ?? 0)}
								onValueChange={(val) =>
									update("yearsOfExperience", Number(val))
								}
								options={YEARS_OF_EXPERIENCE_OPTIONS}
								placeholder="Select years"
							/>
						</InputLabelWrapper>
					</XStack>

					<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
						Summary
					</h3>
					<InputLabelWrapper>
						<Label htmlFor="profile-summary">Summary</Label>
						<Textarea
							id="profile-summary"
							value={profile?.summary ?? ""}
							onChange={(
								e: React.ChangeEvent<HTMLTextAreaElement>,
							) => update("summary", e.target.value)}
						/>
					</InputLabelWrapper>

					<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
						Skills & Expertise
					</h3>
					<InputLabelWrapper>
						<Label>Skills</Label>
						<MultiInput
							values={profile?.skills ?? []}
							onChange={(vals) => update("skills", vals)}
							max={100}
						/>
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label>
							Domain Expertise
							<Tooltip
								iconClassName="size-3.5 text-muted-foreground"
								content="Industries or domains you have worked in (e.g. fintech, healthcare, e-commerce). Used by the LLM to gauge industry fit when scoring roles and tailoring resumes."
							/>
						</Label>
						<MultiInput
							values={profile?.domainExpertise ?? []}
							onChange={(vals) => update("domainExpertise", vals)}
							max={20}
							placeholder="Fintech, Healthcare, e-commerce, etc."
						/>
					</InputLabelWrapper>

					<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
						Preferences
					</h3>
					<InputLabelWrapper>
						<Label>Preferred Location Types</Label>
						<MultiSelect
							values={
								(profile?.preferredLocationTypes as TLocationType[]) ??
								[]
							}
							onValueChange={(vals) =>
								update(
									"preferredLocationTypes",
									vals as TLocationType[],
								)
							}
							options={LOCATION_TYPE_OPTIONS}
							max={LOCATION_TYPE_OPTIONS.length}
							placeholder="Add a location type"
						/>
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label>Preferred Locations</Label>
						<MultiInput
							values={profile?.preferredLocations ?? []}
							onChange={(vals) =>
								update("preferredLocations", vals)
							}
							max={20}
							placeholder="Seattle WA, San Francisco CA, etc."
						/>
					</InputLabelWrapper>
					<XStack className="gap-4">
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-salary-min">
								Salary Min
							</Label>
							<InputGroup>
								<InputGroupAddon>$</InputGroupAddon>
								<InputGroupInput
									id="profile-salary-min"
									inputMode="numeric"
									value={formatCurrency(
										profile?.salaryMin ?? 0,
									)}
									onChange={(e) =>
										update(
											"salaryMin",
											parseCurrency(e.target.value),
										)
									}
									placeholder="80,000"
								/>
							</InputGroup>
						</InputLabelWrapper>
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-salary-max">
								Salary Max
							</Label>
							<InputGroup>
								<InputGroupAddon>$</InputGroupAddon>
								<InputGroupInput
									id="profile-salary-max"
									inputMode="numeric"
									value={formatCurrency(
										profile?.salaryMax ?? 0,
									)}
									onChange={(e) =>
										update(
											"salaryMax",
											parseCurrency(e.target.value),
										)
									}
									placeholder="120,000"
								/>
							</InputGroup>
						</InputLabelWrapper>
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="profile-desired-salary">
								Desired Salary
							</Label>
							<InputGroup>
								<InputGroupAddon>$</InputGroupAddon>
								<InputGroupInput
									id="profile-desired-salary"
									inputMode="numeric"
									value={formatCurrency(
										profile?.desiredSalary ?? 0,
									)}
									onChange={(e) =>
										update(
											"desiredSalary",
											parseCurrency(e.target.value),
										)
									}
									placeholder="100,000"
								/>
							</InputGroup>
						</InputLabelWrapper>
					</XStack>
					<InputLabelWrapper>
						<Label htmlFor="profile-start-date-weeks">
							Start Date (Weeks Out)
						</Label>
						<Input
							id="profile-start-date-weeks"
							type="number"
							value={profile?.startDateWeeksOut ?? 2}
							onChange={(e) =>
								update(
									"startDateWeeksOut",
									Number(e.target.value),
								)
							}
						/>
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label>
							Preferred Industries
							<Tooltip
								iconClassName="size-3.5 text-muted-foreground"
								content="Industries you want to work in (e.g. climate tech, gaming, biotech). Used by the LLM to score industry fit on new roles. Different from Domain Expertise, which is what you have actually worked in."
							/>
						</Label>
						<MultiInput
							values={profile?.industries ?? []}
							onChange={(vals) => update("industries", vals)}
							max={20}
						/>
					</InputLabelWrapper>
					<InputLabelWrapper>
						<Label>
							Dealbreakers
							<Tooltip
								iconClassName="size-3.5 text-muted-foreground"
								content="Anything you refuse to work with — skills, tools, technologies, industries, company sizes, work styles, etc. (e.g. PHP, defense, on-call, startups under 50). Any match forces the role's score below 20."
							/>
						</Label>
						<MultiInput
							values={profile?.dealbreakers ?? []}
							onChange={(vals) => update("dealbreakers", vals)}
							max={20}
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
