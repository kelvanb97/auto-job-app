import { getCompany } from "@aja-api/company/api/get-company"
import { getRole } from "@aja-api/role/api/get-role"
import { USER_PROFILE } from "@aja-api/score/config/profile"
import { scoreRole } from "@aja-api/score/lib/claude-client"
import { buildScoringPrompt } from "@aja-api/score/prompt/scoring-prompt"
import { loadDataset } from "./dataset.js"
import { writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const RESULTS_PATH = resolve(__dirname, "../../data/eval-results.json")

const RATE_LIMIT_MS = Number(process.env["SCORER_RATE_LIMIT_MS"] ?? "500")

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export type TEvalResult = {
	roleId: string
	title: string
	humanScore: number
	modelScore: number
	diff: number
}

export type TEvalReport = {
	results: TEvalResult[]
	mae: number
	rmse: number
	count: number
	evaluatedAt: string
}

export async function runEvaluator(): Promise<TEvalReport> {
	const dataset = await loadDataset()

	if (dataset.length === 0) {
		console.log("No labeled data. Run `pnpm label` first.")
		return { results: [], mae: 0, rmse: 0, count: 0, evaluatedAt: new Date().toISOString() }
	}

	console.log(`[eval] Evaluating ${dataset.length} labeled roles...\n`)

	const results: TEvalResult[] = []

	for (const label of dataset) {
		const roleResult = await getRole(label.roleId)
		if (!roleResult.ok) {
			console.warn(`[eval] Could not fetch role ${label.roleId}, skipping`)
			continue
		}

		const role = roleResult.data
		const company = role.companyId
			? await getCompany(role.companyId).then((r) =>
					r.ok ? r.data : null,
				)
			: null

		const { system, user } = buildScoringPrompt(role, company, USER_PROFILE)

		try {
			const response = await scoreRole(system, user)
			const diff = response.score - label.humanScore

			results.push({
				roleId: role.id,
				title: role.title,
				humanScore: label.humanScore,
				modelScore: response.score,
				diff,
			})

			const marker =
				Math.abs(diff) > 20 ? " ⚠" : Math.abs(diff) > 10 ? " *" : ""
			console.log(
				`  ${role.title}: human=${label.humanScore} model=${response.score} diff=${diff > 0 ? "+" : ""}${diff}${marker}`,
			)
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			console.error(`[eval] Error scoring "${role.title}": ${message}`)
		}

		await delay(RATE_LIMIT_MS)
	}

	const diffs = results.map((r) => r.diff)
	const mae =
		diffs.length > 0
			? diffs.reduce((sum, d) => sum + Math.abs(d), 0) / diffs.length
			: 0
	const rmse =
		diffs.length > 0
			? Math.sqrt(
					diffs.reduce((sum, d) => sum + d * d, 0) / diffs.length,
				)
			: 0

	const report: TEvalReport = {
		results,
		mae: Math.round(mae * 100) / 100,
		rmse: Math.round(rmse * 100) / 100,
		count: results.length,
		evaluatedAt: new Date().toISOString(),
	}

	console.log(`\n[eval] Results: MAE=${report.mae} RMSE=${report.rmse} (n=${report.count})`)

	await mkdir(dirname(RESULTS_PATH), { recursive: true })
	await writeFile(RESULTS_PATH, JSON.stringify(report, null, 2) + "\n")
	console.log(`[eval] Saved to data/eval-results.json`)

	return report
}
