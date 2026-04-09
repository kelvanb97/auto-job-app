import Anthropic from "@anthropic-ai/sdk"
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
	const client = new Anthropic({ apiKey: params.apiKey })

	const inputSchema = z.toJSONSchema(params.schema)

	const message = await client.messages.create({
		model: params.model,
		max_tokens: params.maxTokens ?? 1024,
		system: params.system,
		messages: [{ role: "user", content: params.user }],
		tools: [
			{
				name: "respond",
				description: "Respond with structured output",
				input_schema: inputSchema as {
					type: "object"
					[key: string]: unknown
				},
			},
		],
		tool_choice: { type: "tool", name: "respond" },
	})

	const toolUse = message.content.find((block) => block.type === "tool_use")
	if (!toolUse || toolUse.type !== "tool_use") {
		throw new Error("No tool use block in response")
	}

	return params.schema.parse(toolUse.input)
}
