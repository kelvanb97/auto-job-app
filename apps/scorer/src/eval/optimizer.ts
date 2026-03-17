import Anthropic from "@anthropic-ai/sdk"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { runEvaluator } from "./evaluator.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROMPT_PATH = resolve(
	__dirname,
	"../../../../packages/_api/score/src/prompt/scoring-prompt.ts",
)
const SUGGESTIONS_PATH = resolve(
	__dirname,
	"../../data/prompt-suggestions.md",
)

const client = new Anthropic()

export async function runOptimizer(): Promise<void> {
	console.log("[optimize] Running eval first...\n")
	const report = await runEvaluator()

	if (report.count === 0) {
		console.log("[optimize] No eval results to optimize against.")
		return
	}

	const currentPrompt = await readFile(PROMPT_PATH, "utf-8")

	const worstMismatches = report.results
		.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
		.slice(0, 10)

	const mismatchTable = worstMismatches
		.map(
			(r) =>
				`- "${r.title}": human=${r.humanScore}, model=${r.modelScore}, diff=${r.diff > 0 ? "+" : ""}${r.diff}`,
		)
		.join("\n")

	const message = await client.messages.create({
		model: "claude-haiku-4-5-20251001",
		max_tokens: 4096,
		messages: [
			{
				role: "user",
				content: `You are a prompt engineering expert. I have a scoring prompt that evaluates job postings against a candidate profile (0-100). The current metrics are:

MAE: ${report.mae}
RMSE: ${report.rmse}
Sample size: ${report.count}

Worst mismatches:
${mismatchTable}

Current prompt file:
\`\`\`typescript
${currentPrompt}
\`\`\`

Analyze the mismatches and suggest specific improvements to the system prompt text in the \`buildScoringPrompt\` function. Focus on:
1. Better calibration of the scoring scale
2. Clearer weighting of factors
3. Edge cases the current prompt misses

Return your suggestions as a markdown document with:
- Analysis of what's going wrong
- Specific suggested changes to the system prompt string
- The full revised system prompt ready to copy-paste`,
			},
		],
	})

	const suggestion = message.content
		.filter((block) => block.type === "text")
		.map((block) => block.text)
		.join("")

	const output = `# Prompt Optimization Suggestions

Generated: ${new Date().toISOString()}
Eval metrics: MAE=${report.mae}, RMSE=${report.rmse}, n=${report.count}

---

${suggestion}
`

	await mkdir(dirname(SUGGESTIONS_PATH), { recursive: true })
	await writeFile(SUGGESTIONS_PATH, output)

	console.log(`\n[optimize] Suggestions written to data/prompt-suggestions.md`)
	console.log("[optimize] Review the suggestions and update packages/_api/score/src/prompt/scoring-prompt.ts manually.")
	console.log("[optimize] Then run `pnpm eval` to measure improvement.")
}
