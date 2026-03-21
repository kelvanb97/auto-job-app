import { z } from "zod"

export const coverLetterResponseSchema = z.object({
	greeting: z.string(),
	body: z.string(),
	signoff: z.string(),
})

export type TCoverLetterResponse = z.infer<typeof coverLetterResponseSchema>
