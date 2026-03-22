import { runBatchScore, type TScoreSummary } from "@aja-app/score/batch-score"

export type { TScoreSummary }

const RATE_LIMIT_MS = Number(process.env["SCORE_RATE_LIMIT_MS"] ?? "500")
const BATCH_SIZE = Number(process.env["SCORE_BATCH_SIZE"] ?? "5")

export async function runScore(): Promise<TScoreSummary> {
	return runBatchScore({
		batchSize: BATCH_SIZE,
		rateLimitMs: RATE_LIMIT_MS,
	})
}
