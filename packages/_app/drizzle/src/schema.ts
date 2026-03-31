import {
	index,
	int,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core"

// =============================================================
// COMPANY
// =============================================================

export const company = sqliteTable(
	"company",
	{
		id: int("id").primaryKey({ autoIncrement: true }),
		name: text("name").notNull(),
		website: text("website"),
		linkedinUrl: text("linkedin_url"),
		size: text("size"),
		stage: text("stage"),
		industry: text("industry"),
		createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
			() => new Date(),
		),
		updatedAt: int("updated_at", { mode: "timestamp" })
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date()),
		notes: text("notes"),
	},
	(table) => [index("idx_company_name").on(table.name)],
)

export type TCompany = typeof company.$inferSelect
export type TNewCompany = typeof company.$inferInsert

// =============================================================
// ROLE
// =============================================================

export const role = sqliteTable(
	"role",
	{
		id: int("id").primaryKey({ autoIncrement: true }),
		companyId: int("company_id").references(() => company.id, {
			onDelete: "cascade",
		}),
		title: text("title").notNull(),
		url: text("url"),
		description: text("description"),
		source: text("source"),
		locationType: text("location_type"),
		location: text("location"),
		salaryMin: int("salary_min"),
		salaryMax: int("salary_max"),
		status: text("status").notNull().default("pending"),
		postedAt: int("posted_at", { mode: "timestamp" }),
		createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
			() => new Date(),
		),
		updatedAt: int("updated_at", { mode: "timestamp" })
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date()),
		notes: text("notes"),
	},
	(table) => [
		index("idx_role_company_id").on(table.companyId),
		index("idx_role_status").on(table.status),
		index("idx_role_status_created_at").on(table.status, table.createdAt),
		index("idx_role_url").on(table.url),
		uniqueIndex("idx_role_company_id_title").on(
			table.companyId,
			table.title,
		),
	],
)

export type TRole = typeof role.$inferSelect
export type TNewRole = typeof role.$inferInsert

// =============================================================
// SCORE
// =============================================================

export const score = sqliteTable(
	"score",
	{
		id: int("id").primaryKey({ autoIncrement: true }),
		roleId: int("role_id")
			.unique()
			.references(() => role.id, { onDelete: "cascade" }),
		score: int("score").notNull(),
		positive: text("positive", { mode: "json" }).$type<string[]>(),
		negative: text("negative", { mode: "json" }).$type<string[]>(),
		createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
			() => new Date(),
		),
		updatedAt: int("updated_at", { mode: "timestamp" })
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date()),
	},
	(table) => [index("idx_score_role_id").on(table.roleId)],
)

export type TScore = typeof score.$inferSelect
export type TNewScore = typeof score.$inferInsert

// =============================================================
// PERSON
// =============================================================

export const person = sqliteTable(
	"person",
	{
		id: int("id").primaryKey({ autoIncrement: true }),
		companyId: int("company_id").references(() => company.id, {
			onDelete: "set null",
		}),
		name: text("name").notNull(),
		title: text("title"),
		email: text("email"),
		linkedinUrl: text("linkedin_url"),
		createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
			() => new Date(),
		),
		updatedAt: int("updated_at", { mode: "timestamp" })
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date()),
		notes: text("notes"),
	},
	(table) => [index("idx_person_company_id").on(table.companyId)],
)

export type TPerson = typeof person.$inferSelect
export type TNewPerson = typeof person.$inferInsert

// =============================================================
// ROLE_PERSON (join table)
// =============================================================

export const rolePerson = sqliteTable(
	"role_person",
	{
		roleId: int("role_id")
			.notNull()
			.references(() => role.id, { onDelete: "cascade" }),
		personId: int("person_id")
			.notNull()
			.references(() => person.id, { onDelete: "cascade" }),
		relationship: text("relationship"),
	},
	(table) => [
		primaryKey({ columns: [table.roleId, table.personId] }),
		index("idx_role_person_role_id").on(table.roleId),
		index("idx_role_person_person_id").on(table.personId),
	],
)

export type TRolePerson = typeof rolePerson.$inferSelect
export type TNewRolePerson = typeof rolePerson.$inferInsert

// =============================================================
// INTERACTION
// =============================================================

export const interaction = sqliteTable(
	"interaction",
	{
		id: int("id").primaryKey({ autoIncrement: true }),
		roleId: int("role_id").references(() => role.id, {
			onDelete: "cascade",
		}),
		personId: int("person_id").references(() => person.id, {
			onDelete: "set null",
		}),
		type: text("type").notNull(),
		notes: text("notes"),
		createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
			() => new Date(),
		),
		updatedAt: int("updated_at", { mode: "timestamp" })
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index("idx_interaction_role_id").on(table.roleId),
		index("idx_interaction_person_id").on(table.personId),
	],
)

export type TInteraction = typeof interaction.$inferSelect
export type TNewInteraction = typeof interaction.$inferInsert

// =============================================================
// APPLICATION
// =============================================================

export const application = sqliteTable(
	"application",
	{
		id: int("id").primaryKey({ autoIncrement: true }),
		roleId: int("role_id").references(() => role.id, {
			onDelete: "cascade",
		}),
		status: text("status").notNull().default("submitted"),
		resumePath: text("resume_path"),
		coverLetterPath: text("cover_letter_path"),
		screenshotPath: text("screenshot_path"),
		submittedAt: int("submitted_at", { mode: "timestamp" }).$defaultFn(
			() => new Date(),
		),
		createdAt: int("created_at", { mode: "timestamp" }).$defaultFn(
			() => new Date(),
		),
		updatedAt: int("updated_at", { mode: "timestamp" })
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date()),
		notes: text("notes"),
	},
	(table) => [
		index("idx_application_role_id").on(table.roleId),
		index("idx_application_status").on(table.status),
	],
)

export type TApplication = typeof application.$inferSelect
export type TNewApplication = typeof application.$inferInsert
