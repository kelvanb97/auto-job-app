import { runApply } from "./apply"

async function main() {
	console.log("Running apply...")
	await runApply()
	console.log("Apply complete.")
	process.exit(0)
}

main().catch((err) => {
	console.error("Fatal error:", err)
	process.exit(1)
})
