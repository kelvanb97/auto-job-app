import { type TLocationType } from "@rja-api/role/schema/role-schema"
import {
	Card,
	CardContent,
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
import { Select } from "@rja-design/ui/library/select"
import { Textarea } from "@rja-design/ui/library/text-area"
import { Tooltip } from "@rja-design/ui/library/tooltip"
import { XStack } from "@rja-design/ui/primitives/x-stack"
import { YStack } from "@rja-design/ui/primitives/y-stack"

export interface IRoleFieldsValues {
	title: string
	url: string
	description: string
	source: string
	locationType: string
	location: string
	salaryMin: string
	salaryMax: string
	notes: string
}

const LOCATION_TYPE_OPTIONS: { label: string; value: TLocationType }[] = [
	{ label: "Remote", value: "remote" },
	{ label: "Hybrid", value: "hybrid" },
	{ label: "On-site", value: "on-site" },
]

function formatCurrency(value: string): string {
	const digits = value.replace(/\D/g, "")
	if (!digits) return ""
	return Number(digits).toLocaleString("en-US")
}

function parseCurrency(formatted: string): string {
	return formatted.replace(/,/g, "")
}

interface IRoleFieldsCardProps {
	values: IRoleFieldsValues
	onChange: (values: IRoleFieldsValues) => void
}

export function RoleFieldsCard({ values, onChange }: IRoleFieldsCardProps) {
	const update = (field: keyof IRoleFieldsValues, value: string) => {
		onChange({ ...values, [field]: value })
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Role</CardTitle>
			</CardHeader>
			<CardContent>
				<YStack className="gap-4">
					<InputLabelWrapper>
						<Label htmlFor="role-title" showRequiredIcon>
							Title
						</Label>
						<Input
							id="role-title"
							value={values.title}
							onChange={(e) => update("title", e.target.value)}
							placeholder="Senior Software Engineer"
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label htmlFor="role-url">
							Application URL
							<Tooltip
								iconClassName="size-3.5 text-muted-foreground"
								content="Link to the application form or job listing"
							/>
						</Label>
						<Input
							id="role-url"
							value={values.url}
							onChange={(e) => update("url", e.target.value)}
							placeholder="https://..."
						/>
					</InputLabelWrapper>

					<XStack className="gap-4">
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="role-source">
								Source
								<Tooltip
									iconClassName="size-3.5 text-muted-foreground"
									content="Where you found the job e.g. LinkedIn, Glassdoor, etc."
								/>
							</Label>
							<Input
								id="role-source"
								value={values.source}
								onChange={(e) =>
									update("source", e.target.value)
								}
								placeholder="LinkedIn, Hacker News, etc."
							/>
						</InputLabelWrapper>
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="role-location-type">
								Location Type
							</Label>
							<Select
								value={values.locationType || null}
								onValueChange={(val) =>
									update("locationType", val)
								}
								options={LOCATION_TYPE_OPTIONS}
								placeholder="Select type"
							/>
						</InputLabelWrapper>
					</XStack>

					<InputLabelWrapper>
						<Label htmlFor="role-location">Location</Label>
						<Input
							id="role-location"
							value={values.location}
							onChange={(e) => update("location", e.target.value)}
							placeholder="San Francisco, CA"
						/>
					</InputLabelWrapper>

					<XStack className="gap-4">
						<InputLabelWrapper className="flex-1">
							<Label htmlFor="role-salary-min">Salary Min</Label>
							<InputGroup>
								<InputGroupAddon>$</InputGroupAddon>
								<InputGroupInput
									id="role-salary-min"
									inputMode="numeric"
									value={formatCurrency(values.salaryMin)}
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
							<Label htmlFor="role-salary-max">Salary Max</Label>
							<InputGroup>
								<InputGroupAddon>$</InputGroupAddon>
								<InputGroupInput
									id="role-salary-max"
									inputMode="numeric"
									value={formatCurrency(values.salaryMax)}
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
					</XStack>

					<InputLabelWrapper>
						<Label htmlFor="role-description">
							Job Description
						</Label>
						<Textarea
							id="role-description"
							value={values.description}
							onChange={(
								e: React.ChangeEvent<HTMLTextAreaElement>,
							) => update("description", e.target.value)}
							placeholder="Job description..."
						/>
					</InputLabelWrapper>

					<InputLabelWrapper>
						<Label htmlFor="role-notes">Notes</Label>
						<Textarea
							id="role-notes"
							value={values.notes}
							onChange={(
								e: React.ChangeEvent<HTMLTextAreaElement>,
							) => update("notes", e.target.value)}
							placeholder="Any notes about the role..."
						/>
					</InputLabelWrapper>
				</YStack>
			</CardContent>
		</Card>
	)
}
