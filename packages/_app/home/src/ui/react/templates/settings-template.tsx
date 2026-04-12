"use client"

import type { TEeoConfig } from "@rja-api/settings/schema/eeo-config-schema"
import type { TFormDefaults } from "@rja-api/settings/schema/form-defaults-schema"
import type { TLlmConfig } from "@rja-api/settings/schema/llm-config-schema"
import type { TScoringConfig } from "@rja-api/settings/schema/scoring-config-schema"
import type { TScraperConfig } from "@rja-api/settings/schema/scraper-config-schema"
import type { TUserProfileFull } from "@rja-api/settings/schema/user-profile-schema"
import {
	BarChart3,
	Braces,
	Briefcase,
	FileText,
	GraduationCap,
	Linkedin,
	Search,
	Shield,
	User,
	type LucideIcon,
} from "@rja-design/ui/assets/lucide"
import { cn } from "@rja-design/ui/cn"
import { XStack } from "@rja-design/ui/primitives/x-stack"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import { EducationCard } from "#molecules/settings/education-card"
import { EeoCard } from "#molecules/settings/eeo-card"
import { FormDefaultsCard } from "#molecules/settings/form-defaults-card"
import { ImportFromResumeBar } from "#molecules/settings/import-from-resume-bar"
import { JsonEditorCard } from "#molecules/settings/json-editor-card"
import { LinkedInCard } from "#molecules/settings/linkedin-card"
import { LlmMissingBanner } from "#molecules/settings/llm-missing-banner"
import { ProfileCard } from "#molecules/settings/profile-card"
import { ScoringWeightsCard } from "#molecules/settings/scoring-weights-card"
import { ScraperConfigCard } from "#molecules/settings/scraper-config-card"
import { WorkExperienceCard } from "#molecules/settings/work-experience-card"
import { useRouter } from "next/navigation"
import { useCallback, useState } from "react"

type TTab = {
	key: string
	label: string
	icon: LucideIcon
}

type TSection = {
	label: string
	tabs: TTab[]
}

const SECTIONS: TSection[] = [
	{
		label: "Profile",
		tabs: [
			{ key: "profile", label: "Profile", icon: User },
			{ key: "work-experience", label: "Experience", icon: Briefcase },
			{ key: "education", label: "Education", icon: GraduationCap },
		],
	},
	{
		label: "Application",
		tabs: [
			{ key: "eeo", label: "EEO & Work Auth", icon: Shield },
			{ key: "form-defaults", label: "Form Defaults", icon: FileText },
			{ key: "scoring", label: "Scoring Weights", icon: BarChart3 },
		],
	},
	{
		label: "Scraper",
		tabs: [
			{ key: "scraper", label: "Scraper Config", icon: Search },
			{ key: "linkedin", label: "LinkedIn", icon: Linkedin },
		],
	},
	{
		label: "Advanced",
		tabs: [{ key: "json", label: "JSON Editor", icon: Braces }],
	},
]

type TTabKey = string

interface ISettingsTemplateProps {
	profile: TUserProfileFull | null
	eeo: TEeoConfig | null
	formDefaults: TFormDefaults | null
	scoring: TScoringConfig | null
	scraper: TScraperConfig | null
	llm: TLlmConfig | null
}

export function SettingsTemplate({
	profile,
	eeo,
	formDefaults,
	scoring,
	scraper,
	llm,
}: ISettingsTemplateProps) {
	const [activeTab, setActiveTab] = useState<TTabKey>("profile")
	const router = useRouter()
	const onSaved = useCallback(() => router.refresh(), [router])

	const llmConfigured = !!(llm?.anthropicApiKey || llm?.openaiApiKey)

	return (
		<YStack className="h-full gap-0">
			{llmConfigured ? (
				<ImportFromResumeBar profile={profile} onImported={onSaved} />
			) : (
				<LlmMissingBanner />
			)}
			<XStack className="flex-1 gap-0">
				<YStack className="w-48 shrink-0 border-r border-border pr-2 pt-1">
					{SECTIONS.map((section, sectionIdx) => (
						<div key={section.label}>
							{sectionIdx > 0 && (
								<div className="mx-2 my-1.5 h-px bg-border" />
							)}
							<div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
								{section.label}
							</div>
							{section.tabs.map((tab) => {
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
						</div>
					))}
				</YStack>

				<div className="flex-1 overflow-y-auto pl-6 pb-6">
					{activeTab === "profile" && (
						<ProfileCard profile={profile} onSaved={onSaved} />
					)}
					{activeTab === "work-experience" &&
						(profile ? (
							<WorkExperienceCard
								profileId={profile.id}
								workExperience={profile.workExperience}
								onSaved={onSaved}
							/>
						) : (
							<NeedsProfile tab="Experience" />
						))}
					{activeTab === "education" &&
						(profile ? (
							<EducationCard
								profileId={profile.id}
								education={profile.education}
								onSaved={onSaved}
							/>
						) : (
							<NeedsProfile tab="Education" />
						))}
					{activeTab === "eeo" &&
						(profile ? (
							<EeoCard
								profileId={profile.id}
								eeo={eeo}
								onSaved={onSaved}
							/>
						) : (
							<NeedsProfile tab="EEO & Work Auth" />
						))}
					{activeTab === "form-defaults" &&
						(profile ? (
							<FormDefaultsCard
								profileId={profile.id}
								formDefaults={formDefaults}
								onSaved={onSaved}
							/>
						) : (
							<NeedsProfile tab="Form Defaults" />
						))}
					{activeTab === "scoring" &&
						(profile ? (
							<ScoringWeightsCard
								profileId={profile.id}
								scoring={scoring}
								onSaved={onSaved}
							/>
						) : (
							<NeedsProfile tab="Scoring Weights" />
						))}
					{activeTab === "scraper" &&
						(profile ? (
							<ScraperConfigCard
								profileId={profile.id}
								scraper={scraper}
								onSaved={onSaved}
							/>
						) : (
							<NeedsProfile tab="Scraper Config" />
						))}
					{activeTab === "linkedin" &&
						(profile ? (
							<LinkedInCard
								profileId={profile.id}
								scraper={scraper}
								onSaved={onSaved}
							/>
						) : (
							<NeedsProfile tab="LinkedIn" />
						))}
					{activeTab === "json" && (
						<JsonEditorCard
							profile={profile}
							eeo={eeo}
							formDefaults={formDefaults}
							scoring={scoring}
							scraper={scraper}
							onSaved={onSaved}
						/>
					)}
				</div>
			</XStack>
		</YStack>
	)
}

function NeedsProfile({ tab }: { tab: string }) {
	return (
		<YStack className="gap-2 rounded-md border border-dashed border-border p-6">
			<span className="text-sm font-medium">No profile yet</span>
			<span className="text-sm text-muted-foreground">
				Create your profile first — fill in the Profile tab by hand or
				upload a resume at the top of this page to auto-populate it.
				Once a profile exists, {tab} will be editable here.
			</span>
		</YStack>
	)
}
