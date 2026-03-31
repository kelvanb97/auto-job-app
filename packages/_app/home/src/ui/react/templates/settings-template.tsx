"use client"

import type { TEeoConfig } from "@rja-api/settings/schema/eeo-config-schema"
import type { TFormDefaults } from "@rja-api/settings/schema/form-defaults-schema"
import type { TScoringConfig } from "@rja-api/settings/schema/scoring-config-schema"
import type { TScraperConfig } from "@rja-api/settings/schema/scraper-config-schema"
import type { TUserProfileFull } from "@rja-api/settings/schema/user-profile-schema"
import {
	BarChart3,
	Briefcase,
	FileText,
	Globe,
	GraduationCap,
	Linkedin,
	Search,
	Shield,
	User,
	type LucideIcon,
} from "@rja-design/ui/assets/lucide"
import { cn } from "@rja-design/ui/cn"
import { TextBody } from "@rja-design/ui/library/text"
import { XStack } from "@rja-design/ui/primitives/x-stack"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import { EducationCard } from "#molecules/settings/education-card"
import { EeoCard } from "#molecules/settings/eeo-card"
import { FormDefaultsCard } from "#molecules/settings/form-defaults-card"
import { GoogleJobsCard } from "#molecules/settings/google-jobs-card"
import { LinkedInCard } from "#molecules/settings/linkedin-card"
import { ProfileCard } from "#molecules/settings/profile-card"
import { ScoringWeightsCard } from "#molecules/settings/scoring-weights-card"
import { ScraperConfigCard } from "#molecules/settings/scraper-config-card"
import { WorkExperienceCard } from "#molecules/settings/work-experience-card"
import { useState } from "react"

const TABS = [
	{ key: "profile", label: "Profile", icon: User },
	{ key: "work-experience", label: "Experience", icon: Briefcase },
	{ key: "education", label: "Education", icon: GraduationCap },
	{ key: "eeo", label: "EEO & Work Auth", icon: Shield },
	{ key: "form-defaults", label: "Form Defaults", icon: FileText },
	{ key: "scoring", label: "Scoring Weights", icon: BarChart3 },
	{ key: "scraper", label: "Scraper Config", icon: Search },
	{ key: "google-jobs", label: "Google Jobs", icon: Globe },
	{ key: "linkedin", label: "LinkedIn", icon: Linkedin },
] as const satisfies ReadonlyArray<{
	key: string
	label: string
	icon: LucideIcon
}>

type TTabKey = (typeof TABS)[number]["key"]

interface ISettingsTemplateProps {
	profile: TUserProfileFull | null
	eeo: TEeoConfig | null
	formDefaults: TFormDefaults | null
	scoring: TScoringConfig | null
	scraper: TScraperConfig | null
}

export function SettingsTemplate({
	profile,
	eeo,
	formDefaults,
	scoring,
	scraper,
}: ISettingsTemplateProps) {
	const [activeTab, setActiveTab] = useState<TTabKey>("profile")

	if (!profile) {
		return (
			<YStack className="items-center justify-center h-full gap-2">
				<TextBody size="lg" variant="muted-foreground">
					No profile configured yet.
				</TextBody>
				<TextBody size="sm" variant="muted-foreground">
					Run the seed script to populate your settings, or create a
					profile below.
				</TextBody>
			</YStack>
		)
	}

	return (
		<XStack className="h-full gap-0">
			<YStack className="w-48 shrink-0 border-r border-border pr-2 pt-1">
				{TABS.map((tab) => {
					const Icon = tab.icon
					const isActive = activeTab === tab.key
					return (
						<button
							key={tab.key}
							type="button"
							onClick={() => setActiveTab(tab.key)}
							className={cn(
								"flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150 w-full text-left",
								isActive
									? "bg-primary/10 text-primary font-medium"
									: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
							)}
						>
							<Icon
								className={cn(
									"size-4 shrink-0",
									isActive
										? "text-primary"
										: "text-muted-foreground",
								)}
								strokeWidth={isActive ? 2.2 : 1.8}
							/>
							{tab.label}
						</button>
					)
				})}
			</YStack>

			<div className="flex-1 overflow-y-auto pl-6 pb-6">
				{activeTab === "profile" && <ProfileCard profile={profile} />}
				{activeTab === "work-experience" && (
					<WorkExperienceCard
						profileId={profile.id}
						workExperience={profile.workExperience}
					/>
				)}
				{activeTab === "education" && (
					<EducationCard
						profileId={profile.id}
						education={profile.education}
					/>
				)}
				{activeTab === "eeo" && (
					<EeoCard profileId={profile.id} eeo={eeo} />
				)}
				{activeTab === "form-defaults" && (
					<FormDefaultsCard
						profileId={profile.id}
						formDefaults={formDefaults}
					/>
				)}
				{activeTab === "scoring" && (
					<ScoringWeightsCard
						profileId={profile.id}
						scoring={scoring}
					/>
				)}
				{activeTab === "scraper" && (
					<ScraperConfigCard
						profileId={profile.id}
						scraper={scraper}
					/>
				)}
				{activeTab === "google-jobs" && (
					<GoogleJobsCard profileId={profile.id} scraper={scraper} />
				)}
				{activeTab === "linkedin" && (
					<LinkedInCard profileId={profile.id} scraper={scraper} />
				)}
			</div>
		</XStack>
	)
}
