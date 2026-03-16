import { Button } from "@aja-design/ui/library/button"
import { Input } from "@aja-design/ui/library/input"
import { Select } from "@aja-design/ui/library/select"
import { XStack } from "@aja-design/ui/primitives/x-stack"
import { YStack } from "@aja-design/ui/primitives/y-stack"
import { useRef, useState } from "react"

export interface IRolesFilters {
	search: string
	status: string | undefined
	locationType: string | undefined
	source: string | undefined
}

const STATUS_CHIPS = [
	{ label: "All", value: undefined },
	{ label: "Pending", value: "pending" },
	{ label: "Applied", value: "applied" },
	{ label: "Won't Do", value: "wont_do" },
] as const

const LOCATION_TYPE_OPTIONS = [
	{ label: "All", value: "all" },
	{ label: "Remote", value: "Remote" },
	{ label: "Hybrid", value: "Hybrid" },
	{ label: "On-site", value: "On-site" },
]

const SOURCE_OPTIONS = [
	{ label: "All", value: "all" },
	{ label: "LinkedIn", value: "LinkedIn" },
	{ label: "Indeed", value: "Indeed" },
	{ label: "Company Website", value: "Company Website" },
	{ label: "Referral", value: "Referral" },
	{ label: "Recruiter", value: "Recruiter" },
	{ label: "Other", value: "Other" },
]

interface IRolesFilterBarProps {
	filters: IRolesFilters
	onFiltersChange: (filters: IRolesFilters) => void
}

export function RolesFilterBar({
	filters,
	onFiltersChange,
}: IRolesFilterBarProps) {
	const [searchValue, setSearchValue] = useState(filters.search)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const handleSearchChange = (value: string) => {
		setSearchValue(value)
		if (timerRef.current) clearTimeout(timerRef.current)
		timerRef.current = setTimeout(() => {
			onFiltersChange({ ...filters, search: value })
		}, 300)
	}

	return (
		<YStack className="gap-3">
			<XStack className="gap-1">
				{STATUS_CHIPS.map((chip) => (
					<Button
						key={chip.label}
						variant={
							filters.status === chip.value
								? "default"
								: "outline"
						}
						size="sm"
						onClick={() =>
							onFiltersChange({
								...filters,
								status: chip.value,
							})
						}
					>
						{chip.label}
					</Button>
				))}
			</XStack>

			<XStack className="gap-3">
				<Input
					value={searchValue}
					onChange={(e) => handleSearchChange(e.target.value)}
					placeholder="Search roles..."
					className="max-w-xs"
				/>
				<Select
					value={filters.locationType ?? "all"}
					onValueChange={(val) =>
						onFiltersChange({
							...filters,
							locationType:
								val === "all" ? undefined : val,
						})
					}
					options={LOCATION_TYPE_OPTIONS}
					placeholder="Location type"
				/>
				<Select
					value={filters.source ?? "all"}
					onValueChange={(val) =>
						onFiltersChange({
							...filters,
							source: val === "all" ? undefined : val,
						})
					}
					options={SOURCE_OPTIONS}
					placeholder="Source"
				/>
			</XStack>
		</YStack>
	)
}
