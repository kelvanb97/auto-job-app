/**
 * Seed script: populates settings tables from @rja-config/user exports.
 * Run once after migration: pnpm --filter @rja-app/drizzle seed
 */
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { EEO_CONFIG } from "@rja-config/user/eeo"
import { FORM_DEFAULTS, USER_PROFILE } from "@rja-config/user/experience"
import { SCORING_WEIGHTS } from "@rja-config/user/scoring"
import {
	GOOGLE_JOBS_SEARCH,
	LINKEDIN_SEARCH,
	SCRAPER_CONFIG,
} from "@rja-config/user/scraper"
import { initDb } from "@rja-core/drizzle"
import {
	education,
	eeoConfig,
	formDefaults,
	scoringConfig,
	scraperConfig,
	userProfile,
	workExperience,
} from "./src/schema"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Initialize DB with migrations
const database = initDb({
	migrationsFolder: resolve(__dirname, "migrations"),
})

// Check if already seeded
const existing = database.select().from(userProfile).limit(1).get()
if (existing) {
	console.log(
		"Database already seeded — user profile exists with id",
		existing.id,
	)
	process.exit(0)
}

// Seed in a transaction
database.transaction((tx) => {
	// 1. User profile
	const profile = tx
		.insert(userProfile)
		.values({
			name: USER_PROFILE.name,
			email: USER_PROFILE.email,
			phone: USER_PROFILE.phone,
			linkedin: USER_PROFILE.linkedIn,
			github: USER_PROFILE.github,
			personalWebsite: USER_PROFILE.personalWebsite,
			location: USER_PROFILE.location,
			address: "",
			jobTitle: USER_PROFILE.jobTitle,
			seniority: USER_PROFILE.seniority,
			yearsOfExperience: USER_PROFILE.yearsOfExperience,
			summary: USER_PROFILE.summary,
			skills: USER_PROFILE.skills,
			preferredSkills: USER_PROFILE.preferredSkills,
			preferredLocationTypes: USER_PROFILE.preferredLocationTypes,
			preferredLocations: USER_PROFILE.preferredLocations,
			salaryMin: USER_PROFILE.salaryMin,
			salaryMax: USER_PROFILE.salaryMax,
			desiredSalary: USER_PROFILE.desiredSalary,
			startDateWeeksOut: USER_PROFILE.startDateWeeksOut,
			industries: USER_PROFILE.industries,
			dealbreakers: USER_PROFILE.dealbreakers,
			notes: USER_PROFILE.notes,
			domainExpertise: USER_PROFILE.domainExpertise,
		})
		.returning()
		.get()

	console.log("Inserted user profile:", profile.id)

	// 2. Work experience
	for (let i = 0; i < USER_PROFILE.workExperience.length; i++) {
		const exp = USER_PROFILE.workExperience[i]!
		tx.insert(workExperience)
			.values({
				userProfileId: profile.id,
				sortOrder: i,
				company: exp.company,
				title: exp.title,
				startDate: exp.startDate,
				endDate: exp.endDate,
				type: exp.type,
				platforms: exp.platforms,
				techStack: exp.techStack,
				summary: exp.summary,
				highlights: exp.highlights,
			})
			.run()
	}
	console.log(
		"Inserted",
		USER_PROFILE.workExperience.length,
		"work experience entries",
	)

	// 3. Education
	for (let i = 0; i < USER_PROFILE.education.length; i++) {
		const edu = USER_PROFILE.education[i]!
		tx.insert(education)
			.values({
				userProfileId: profile.id,
				sortOrder: i,
				degree: edu.degree,
				field: edu.field,
				institution: edu.institution,
			})
			.run()
	}
	console.log("Inserted", USER_PROFILE.education.length, "education entries")

	// 4. EEO config
	tx.insert(eeoConfig)
		.values({
			userProfileId: profile.id,
			gender: EEO_CONFIG.gender,
			ethnicity: EEO_CONFIG.ethnicity,
			veteranStatus: EEO_CONFIG.veteranStatus,
			disabilityStatus: EEO_CONFIG.disabilityStatus,
			workAuthorization: EEO_CONFIG.workAuthorization,
			requiresVisaSponsorship: EEO_CONFIG.requiresVisaSponsorship,
		})
		.run()
	console.log("Inserted EEO config")

	// 5. Form defaults
	tx.insert(formDefaults)
		.values({
			userProfileId: profile.id,
			howDidYouHear: FORM_DEFAULTS.howDidYouHear,
			referredByEmployee: FORM_DEFAULTS.referredByEmployee,
			nonCompeteAgreement: FORM_DEFAULTS.nonCompeteAgreement,
			previouslyEmployed: FORM_DEFAULTS.previouslyEmployed,
			professionalReferences: FORM_DEFAULTS.professionalReferences,
			employmentType: FORM_DEFAULTS.employmentType,
		})
		.run()
	console.log("Inserted form defaults")

	// 6. Scoring config
	tx.insert(scoringConfig)
		.values({
			userProfileId: profile.id,
			titleAndSeniority: SCORING_WEIGHTS.titleAndSeniority,
			skills: SCORING_WEIGHTS.skills,
			salary: SCORING_WEIGHTS.salary,
			location: SCORING_WEIGHTS.location,
			industry: SCORING_WEIGHTS.industry,
		})
		.run()
	console.log("Inserted scoring config")

	// 7. Scraper config
	tx.insert(scraperConfig)
		.values({
			userProfileId: profile.id,
			relevantKeywords: SCRAPER_CONFIG.relevantKeywords,
			blockedKeywords: SCRAPER_CONFIG.blockedKeywords,
			blockedCompanies: SCRAPER_CONFIG.blockedCompanies,
			enabledSources: SCRAPER_CONFIG.enabledSources,
			googleTitles: [...GOOGLE_JOBS_SEARCH.titles],
			googleRemote: GOOGLE_JOBS_SEARCH.remote,
			googleFullTimeOnly: GOOGLE_JOBS_SEARCH.fullTimeOnly,
			googleFreshnessDays: GOOGLE_JOBS_SEARCH.freshnessdays,
			googleMaxPages: GOOGLE_JOBS_SEARCH.maxPagesPerQuery,
			linkedinUrls: [...LINKEDIN_SEARCH.urls],
			linkedinMaxPages: LINKEDIN_SEARCH.maxPages,
			linkedinMaxPerPage: LINKEDIN_SEARCH.maxPerPage,
		})
		.run()
	console.log("Inserted scraper config")
})

console.log("\nSeed complete!")
