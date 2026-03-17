import { runScorer } from "./scorer.js"
import { runLabeler } from "./eval/labeler.js"
import { runEvaluator } from "./eval/evaluator.js"
import { runOptimizer } from "./eval/optimizer.js"

async function main() {
	if (process.argv.includes("--label")) {
		await runLabeler()
		process.exit(0)
	}

	if (process.argv.includes("--eval")) {
		await runEvaluator()
		process.exit(0)
	}

	if (process.argv.includes("--optimize")) {
		await runOptimizer()
		process.exit(0)
	}

	console.log("Running scorer...")
	const summary = await runScorer()
	console.log("Scoring complete.", JSON.stringify(summary))
	process.exit(0)
}

main().catch((err) => {
	console.error("Fatal error:", err)
	process.exit(1)
})
