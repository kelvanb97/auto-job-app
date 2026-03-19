import { runScorer } from "./scorer.js"

async function main() {
	console.log("Running scorer...")
	const summary = await runScorer()
	console.log("Scoring complete.", JSON.stringify(summary))
	process.exit(0)
}

main().catch((err) => {
	console.error("Fatal error:", err)
	process.exit(1)
})
