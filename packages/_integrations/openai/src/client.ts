import OpenAI from "openai"
import { z } from "zod"

export type TCreateMessageParams<T> = {
	apiKey: string
	model: string
	system: string
	user: string
	maxTokens?: number
	schema: z.ZodType<T>
}

export async function createMessage<T>(
	params: TCreateMessageParams<T>,
): Promise<T> {
	const client = new OpenAI({ apiKey: params.apiKey })

	const inputSchema = z.toJSONSchema(params.schema)

	const completion = await client.chat.completions.create({
		model: params.model,
		max_completion_tokens: params.maxTokens ?? 1024,
		messages: [
			{ role: "system", content: params.system },
			{ role: "user", content: params.user },
		],
		tools: [
			{
				type: "function",
				function: {
					name: "respond",
					description: "Respond with structured output",
					parameters: inputSchema as Record<string, unknown>,
				},
			},
		],
		tool_choice: {
			type: "function",
			function: { name: "respond" },
		},
	})

	const toolCall = completion.choices[0]?.message?.tool_calls?.[0]
	if (!toolCall || toolCall.type !== "function") {
		throw new Error("No function tool call in OpenAI response")
	}

	const parsed = JSON.parse(toolCall.function.arguments) as unknown
	return params.schema.parse(parsed)
}
