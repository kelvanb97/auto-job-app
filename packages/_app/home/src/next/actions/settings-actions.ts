"use server"

import { deleteEducation } from "@rja-api/settings/api/delete-education"
import { deleteWorkExperience } from "@rja-api/settings/api/delete-work-experience"
import { extractResume } from "@rja-api/settings/api/extract-resume"
import { getUserProfile } from "@rja-api/settings/api/get-user-profile"
import { upsertEducation } from "@rja-api/settings/api/upsert-education"
import { upsertEeoConfig } from "@rja-api/settings/api/upsert-eeo-config"
import { upsertFormDefaults } from "@rja-api/settings/api/upsert-form-defaults"
import { upsertLlmConfig } from "@rja-api/settings/api/upsert-llm-config"
import { upsertScoringConfig } from "@rja-api/settings/api/upsert-scoring-config"
import { upsertScraperConfig } from "@rja-api/settings/api/upsert-scraper-config"
import { upsertUserProfile } from "@rja-api/settings/api/upsert-user-profile"
import { upsertWorkExperience } from "@rja-api/settings/api/upsert-work-experience"
import { upsertEeoConfigSchema } from "@rja-api/settings/schema/eeo-config-schema"
import { upsertFormDefaultsSchema } from "@rja-api/settings/schema/form-defaults-schema"
import { upsertLlmConfigSchema } from "@rja-api/settings/schema/llm-config-schema"
import { upsertScoringConfigSchema } from "@rja-api/settings/schema/scoring-config-schema"
import { upsertScraperConfigSchema } from "@rja-api/settings/schema/scraper-config-schema"
import {
	deleteEducationSchema,
	deleteWorkExperienceSchema,
	upsertEducationSchema,
	upsertUserProfileSchema,
	upsertWorkExperienceSchema,
} from "@rja-api/settings/schema/user-profile-schema"
import { actionClient, SafeForClientError } from "@rja-core/next-safe-action"
import { z } from "zod"

export const updateProfileAction = actionClient
	.inputSchema(upsertUserProfileSchema)
	.action(async ({ parsedInput }) => {
		const result = upsertUserProfile(parsedInput)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})

export const upsertWorkExperienceAction = actionClient
	.inputSchema(upsertWorkExperienceSchema)
	.action(async ({ parsedInput }) => {
		const result = upsertWorkExperience(parsedInput)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})

export const deleteWorkExperienceAction = actionClient
	.inputSchema(deleteWorkExperienceSchema)
	.action(async ({ parsedInput }) => {
		const result = deleteWorkExperience(parsedInput.id)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})

export const upsertEducationAction = actionClient
	.inputSchema(upsertEducationSchema)
	.action(async ({ parsedInput }) => {
		const result = upsertEducation(parsedInput)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})

export const deleteEducationAction = actionClient
	.inputSchema(deleteEducationSchema)
	.action(async ({ parsedInput }) => {
		const result = deleteEducation(parsedInput.id)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})

export const updateEeoAction = actionClient
	.inputSchema(upsertEeoConfigSchema)
	.action(async ({ parsedInput }) => {
		const result = upsertEeoConfig(parsedInput)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})

export const updateFormDefaultsAction = actionClient
	.inputSchema(upsertFormDefaultsSchema)
	.action(async ({ parsedInput }) => {
		const result = upsertFormDefaults(parsedInput)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})

export const updateScoringConfigAction = actionClient
	.inputSchema(upsertScoringConfigSchema)
	.action(async ({ parsedInput }) => {
		const result = upsertScoringConfig(parsedInput)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})

export const updateScraperConfigAction = actionClient
	.inputSchema(upsertScraperConfigSchema)
	.action(async ({ parsedInput }) => {
		const result = upsertScraperConfig(parsedInput)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})

export const updateLlmConfigAction = actionClient
	.inputSchema(upsertLlmConfigSchema)
	.action(async ({ parsedInput }) => {
		const result = upsertLlmConfig(parsedInput)
		if (!result.ok) throw new SafeForClientError(result.error.message)
		return result.data
	})

export const saveAllSettingsAction = actionClient
	.inputSchema(z.object({ json: z.string() }))
	.action(async ({ parsedInput }) => {
		const data = JSON.parse(parsedInput.json)

		// Profile
		const profileResult = upsertUserProfile(data.profile)
		if (!profileResult.ok)
			throw new SafeForClientError(profileResult.error.message)
		const profileId = profileResult.data.id

		// Work experience: delete existing, re-insert from JSON
		const existing = getUserProfile()
		if (existing.ok) {
			for (const exp of existing.data.workExperience) {
				deleteWorkExperience(exp.id)
			}
			for (const edu of existing.data.education) {
				deleteEducation(edu.id)
			}
		}

		for (let i = 0; i < (data.workExperience ?? []).length; i++) {
			const exp = data.workExperience[i]
			const result = upsertWorkExperience({
				userProfileId: profileId,
				sortOrder: i,
				company: exp.company,
				title: exp.title,
				startDate: exp.startDate,
				endDate: exp.endDate,
				type: exp.type,
				platforms: exp.platforms ?? [],
				techStack: exp.techStack ?? [],
				summary: exp.summary ?? "",
				highlights: exp.highlights ?? [],
			})
			if (!result.ok) throw new SafeForClientError(result.error.message)
		}

		for (let i = 0; i < (data.education ?? []).length; i++) {
			const edu = data.education[i]
			const result = upsertEducation({
				userProfileId: profileId,
				sortOrder: i,
				degree: edu.degree,
				field: edu.field,
				institution: edu.institution,
			})
			if (!result.ok) throw new SafeForClientError(result.error.message)
		}

		if (data.eeo) {
			const result = upsertEeoConfig({
				userProfileId: profileId,
				...data.eeo,
			})
			if (!result.ok) throw new SafeForClientError(result.error.message)
		}

		if (data.formDefaults) {
			const result = upsertFormDefaults({
				userProfileId: profileId,
				...data.formDefaults,
			})
			if (!result.ok) throw new SafeForClientError(result.error.message)
		}

		if (data.scoring) {
			const result = upsertScoringConfig({
				userProfileId: profileId,
				...data.scoring,
			})
			if (!result.ok) throw new SafeForClientError(result.error.message)
		}

		if (data.scraper) {
			const result = upsertScraperConfig({
				userProfileId: profileId,
				...data.scraper,
			})
			if (!result.ok) throw new SafeForClientError(result.error.message)
		}

		if (data.llm) {
			const result = upsertLlmConfig({
				userProfileId: profileId,
				...data.llm,
			})
			if (!result.ok) throw new SafeForClientError(result.error.message)
		}

		return { ok: true }
	})

export const extractResumeAction = actionClient
	.inputSchema(
		z.object({
			fileName: z.string().min(1),
			fileBase64: z.string().min(1),
		}),
	)
	.action(async ({ parsedInput }) => {
		const buffer = Buffer.from(parsedInput.fileBase64, "base64")
		try {
			return await extractResume(parsedInput.fileName, buffer)
		} catch (e) {
			const message = e instanceof Error ? e.message : String(e)
			throw new SafeForClientError(`Resume extraction failed: ${message}`)
		}
	})

export const applyResumeImportAction = actionClient
	.inputSchema(
		z.object({
			profileId: z.number(),
			profileUpdates: upsertUserProfileSchema.partial(),
			workExperience: z.array(
				upsertWorkExperienceSchema.omit({
					id: true,
					userProfileId: true,
					sortOrder: true,
				}),
			),
			education: z.array(
				upsertEducationSchema.omit({
					id: true,
					userProfileId: true,
					sortOrder: true,
				}),
			),
		}),
	)
	.action(async ({ parsedInput }) => {
		const existing = getUserProfile()
		if (!existing.ok || !existing.data) {
			throw new SafeForClientError(
				"Cannot apply resume import: profile not found.",
			)
		}
		if (existing.data.id !== parsedInput.profileId) {
			throw new SafeForClientError(
				"Profile ID mismatch — refresh the page and try again.",
			)
		}

		// Merge selected extracted fields onto the existing profile.
		const merged = {
			id: existing.data.id,
			name: parsedInput.profileUpdates.name ?? existing.data.name,
			email: parsedInput.profileUpdates.email ?? existing.data.email,
			phone: parsedInput.profileUpdates.phone ?? existing.data.phone,
			linkedin:
				parsedInput.profileUpdates.linkedin ?? existing.data.linkedin,
			github: parsedInput.profileUpdates.github ?? existing.data.github,
			personalWebsite:
				parsedInput.profileUpdates.personalWebsite ??
				existing.data.personalWebsite,
			location:
				parsedInput.profileUpdates.location ?? existing.data.location,
			address:
				parsedInput.profileUpdates.address ?? existing.data.address,
			jobTitle:
				parsedInput.profileUpdates.jobTitle ?? existing.data.jobTitle,
			seniority:
				parsedInput.profileUpdates.seniority ??
				(existing.data.seniority as
					| "junior"
					| "mid"
					| "senior"
					| "staff"
					| "principal"
					| "director"),
			yearsOfExperience:
				parsedInput.profileUpdates.yearsOfExperience ??
				existing.data.yearsOfExperience,
			summary:
				parsedInput.profileUpdates.summary ?? existing.data.summary,
			skills: parsedInput.profileUpdates.skills ?? existing.data.skills,
			preferredSkills:
				parsedInput.profileUpdates.preferredSkills ??
				existing.data.preferredSkills,
			preferredLocationTypes:
				parsedInput.profileUpdates.preferredLocationTypes ??
				existing.data.preferredLocationTypes,
			preferredLocations:
				parsedInput.profileUpdates.preferredLocations ??
				existing.data.preferredLocations,
			salaryMin:
				parsedInput.profileUpdates.salaryMin ?? existing.data.salaryMin,
			salaryMax:
				parsedInput.profileUpdates.salaryMax ?? existing.data.salaryMax,
			desiredSalary:
				parsedInput.profileUpdates.desiredSalary ??
				existing.data.desiredSalary,
			startDateWeeksOut:
				parsedInput.profileUpdates.startDateWeeksOut ??
				existing.data.startDateWeeksOut,
			industries:
				parsedInput.profileUpdates.industries ??
				existing.data.industries,
			dealbreakers:
				parsedInput.profileUpdates.dealbreakers ??
				existing.data.dealbreakers,
			notes: parsedInput.profileUpdates.notes ?? existing.data.notes,
			domainExpertise:
				parsedInput.profileUpdates.domainExpertise ??
				existing.data.domainExpertise,
		}

		const profileResult = upsertUserProfile(merged)
		if (!profileResult.ok)
			throw new SafeForClientError(profileResult.error.message)

		const baseExperienceOrder = existing.data.workExperience.length
		for (let i = 0; i < parsedInput.workExperience.length; i++) {
			const exp = parsedInput.workExperience[i]
			if (!exp) continue
			const result = upsertWorkExperience({
				userProfileId: profileResult.data.id,
				sortOrder: baseExperienceOrder + i,
				...exp,
			})
			if (!result.ok) throw new SafeForClientError(result.error.message)
		}

		const baseEducationOrder = existing.data.education.length
		for (let i = 0; i < parsedInput.education.length; i++) {
			const edu = parsedInput.education[i]
			if (!edu) continue
			const result = upsertEducation({
				userProfileId: profileResult.data.id,
				sortOrder: baseEducationOrder + i,
				...edu,
			})
			if (!result.ok) throw new SafeForClientError(result.error.message)
		}

		return { ok: true }
	})
