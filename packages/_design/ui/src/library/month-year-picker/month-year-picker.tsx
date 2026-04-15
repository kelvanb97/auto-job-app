"use client"

import { Select } from "#library/select/select"
import { XStack } from "#primitives/x-stack"

export const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
] as const

const MONTH_OPTIONS = MONTHS.map((m) => ({ label: m, value: m }))

const CURRENT_YEAR = new Date().getFullYear()
const DEFAULT_YEAR_RANGE = 60

function buildYearOptions(range: number) {
	return Array.from({ length: range }, (_, i) => {
		const y = String(CURRENT_YEAR - i)
		return { label: y, value: y }
	})
}

export function parseMonthYear(value: string): {
	month: string
	year: string
} {
	let month = ""
	let year = ""
	for (const token of value.trim().split(/\s+/)) {
		if (!month && (MONTHS as readonly string[]).includes(token)) {
			month = token
		} else if (!year && /^\d{4}$/.test(token)) {
			year = token
		}
	}
	return { month, year }
}

export function formatMonthYear(month: string, year: string): string {
	return [month, year].filter(Boolean).join(" ")
}

interface IMonthYearPickerProps {
	value: string
	onChange: (val: string) => void
	disabled?: boolean
	yearRange?: number
}

export function MonthYearPicker({
	value,
	onChange,
	disabled = false,
	yearRange = DEFAULT_YEAR_RANGE,
}: IMonthYearPickerProps) {
	const { month, year } = parseMonthYear(value)
	const yearOptions = buildYearOptions(yearRange)
	return (
		<XStack className="gap-2">
			<Select
				value={month || null}
				onValueChange={(m) => onChange(formatMonthYear(m, year))}
				options={MONTH_OPTIONS}
				placeholder="Month"
				disabled={disabled}
				className="flex-1 min-w-0"
			/>
			<Select
				value={year || null}
				onValueChange={(y) => onChange(formatMonthYear(month, y))}
				options={yearOptions}
				placeholder="Year"
				disabled={disabled}
				className="flex-1 min-w-0"
			/>
		</XStack>
	)
}
