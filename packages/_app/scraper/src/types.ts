import type {
	TLocationType,
	TRoleSource,
} from "@rja-api/role/schema/role-schema"

export type ScrapedRole = {
	title: string
	url: string | null
	company: string | null
	description: string | null
	source: TRoleSource
	location_type: TLocationType | null
	location: string | null
	salary_min: number | null
	salary_max: number | null
	posted_at: string | null
}

export type TSourceScrapeOptions = {
	onRole?: (role: ScrapedRole) => Promise<void>
	signal?: AbortSignal | undefined
}
