import { z } from "zod"

export type { TScraperConfig, TNewScraperConfig } from "@rja-app/drizzle"

export const SOURCE_NAMES = ["linkedin"] as const
export type TSourceName = (typeof SOURCE_NAMES)[number]

export const upsertScraperConfigSchema = z.object({
	userProfileId: z.number(),
	relevantKeywords: z.array(z.string()),
	blockedKeywords: z.array(z.string()),
	blockedCompanies: z.array(z.string()),
	enabledSources: z.array(z.string()),
	linkedinUrls: z.array(z.string()),
	linkedinMaxPages: z.number().int().min(1),
	linkedinMaxPerPage: z.number().int().min(1),
})

export type TUpsertScraperConfig = z.infer<typeof upsertScraperConfigSchema>
