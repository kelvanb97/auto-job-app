import { Select } from "@aja-design/ui/library/select"

const STATUS_OPTIONS = [
	{ label: "Pending", value: "pending" },
	{ label: "Applied", value: "applied" },
	{ label: "Won't Do", value: "wont_do" },
]

interface IRoleStatusSelectProps {
	value: string
	onValueChange: (status: string) => void
	disabled?: boolean
}

export function RoleStatusSelect({
	value,
	onValueChange,
	disabled = false,
}: IRoleStatusSelectProps) {
	return (
		<div
			onClick={(e) => e.stopPropagation()}
			onKeyDown={(e) => e.stopPropagation()}
		>
			<Select
				value={value || null}
				onValueChange={onValueChange}
				options={STATUS_OPTIONS}
				placeholder="Status"
				disabled={disabled}
				className="min-w-[120px]"
			/>
		</div>
	)
}
