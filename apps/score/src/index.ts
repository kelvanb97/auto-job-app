import { runScore } from "./score"

async function main() {
	console.log("Running score...")
	const summary = await runScore()
	console.log("Scoring complete.", JSON.stringify(summary))
	process.exit(0)
}

main().catch((err) => {
	console.error("Fatal error:", err)
	process.exit(1)
})
