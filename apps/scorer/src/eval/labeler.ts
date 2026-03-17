import { createInterface } from "node:readline/promises"
import { stdin, stdout } from "node:process"
import { getCompany } from "@aja-api/company/api/get-company"
import { listUnscoredRoles } from "@aja-api/role/api/list-unscored-roles"
import type { TRole } from "@aja-api/role/schema/role-schema"
import { convert } from "html-to-text"
import { saveLabel } from "./dataset.js"

function getArg(flag: string): string | undefined {
	const idx = process.argv.indexOf(flag)
	return idx !== -1 ? process.argv[idx + 1] : undefined
}

function formatRoleForDisplay(
	role: TRole,
	companyName: string | null,
): string {
	const lines = [
		"─".repeat(60),
		`Title: ${role.title}`,
		companyName ? `Company: ${companyName}` : null,
		`Location: ${role.locationType ?? "N/A"}${role.location ? ` · ${role.location}` : ""}`,
		formatSalary(role.salaryMin, role.salaryMax),
		role.source ? `Source: ${role.source}` : null,
		role.description
			? `\nDescription:\n${formatDescription(role.description)}`
			: null,
		"─".repeat(60),
	]

	return lines.filter(Boolean).join("\n")
}

function formatDescription(description: string): string {
	const isHtml = /<[a-z][\s\S]*>/i.test(description)
	const text = isHtml
		? convert(description, { wordwrap: 80 })
		: description
	const trimmed = text.slice(0, 1500)
	return trimmed.length < text.length ? trimmed + "\n..." : trimmed
}

function formatSalary(min: number | null, max: number | null): string {
	if (min === null && max === null) return "Salary: Not listed"
	const fmt = (n: number) => `$${Math.round(n / 1000)}k`
	if (min !== null && max !== null) return `Salary: ${fmt(min)} - ${fmt(max)}`
	if (min !== null) return `Salary: ${fmt(min)}+`
	return `Salary: Up to ${fmt(max!)}`
}

export async function runLabeler(): Promise<void> {
	const count = Number(getArg("--count") || "10")

	const result = await listUnscoredRoles()
	if (!result.ok) {
		throw new Error(result.error.message)
	}

	const roles = result.data.slice(0, count)

	if (roles.length === 0) {
		console.log("No unscored roles to label.")
		return
	}

	console.log(`\nLabeling ${roles.length} roles. Type "skip" to skip, "quit" to stop.\n`)

	const rl = createInterface({ input: stdin, output: stdout })

	try {
		for (let i = 0; i < roles.length; i++) {
			const role = roles[i]!
			const companyName = role.companyId
				? await getCompany(role.companyId).then((r) =>
						r.ok ? r.data.name : null,
					)
				: null

			console.log(`\n[${i + 1}/${roles.length}]`)
			console.log(formatRoleForDisplay(role, companyName))

			const scoreInput = await rl.question("Score (0-100): ")
			if (scoreInput.toLowerCase() === "quit") break
			if (scoreInput.toLowerCase() === "skip") continue

			const score = Number(scoreInput)
			if (isNaN(score) || score < 0 || score > 100) {
				console.log("Invalid score, skipping.")
				continue
			}

			const positiveInput = await rl.question(
				"Positive reasons (comma-separated): ",
			)
			const negativeInput = await rl.question(
				"Negative reasons (comma-separated): ",
			)

			const positive = positiveInput
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
			const negative = negativeInput
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)

			await saveLabel({
				roleId: role.id,
				humanScore: score,
				humanPositive: positive,
				humanNegative: negative,
				labeledAt: new Date().toISOString(),
			})

			console.log(`Saved: score=${score}`)
		}
	} finally {
		rl.close()
	}

	console.log("\nLabeling session complete.")
}
