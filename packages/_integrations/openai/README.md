# @rja-integrations/openai

Thin wrapper around the OpenAI SDK for structured message creation. Normally consumed via `@rja-integrations/llm`, which dispatches to this package based on the user's configured provider.

## Exports

### `createMessage<T>(params)`

Sends a single user message to the OpenAI API using forced function tool-use for structured output, then parses the response against a Zod schema. The caller is responsible for supplying `apiKey` and `model` — this package does not read from environment variables. In this repo, the API key and model come from the user's `llm_config` row via `@rja-api/settings`.

```typescript
import { getLlmConfigForUseCase } from "@rja-api/settings/api/get-llm-config-for-use-case"
import { createMessage } from "@rja-integrations/openai/client"
import { z } from "zod"

const cfg = getLlmConfigForUseCase("scoring")
if (!cfg.ok) throw cfg.error

const result = await createMessage({
  apiKey: cfg.data.apiKey,
  model: cfg.data.model,
  system: "You are a helpful assistant.",
  user: "What is 2 + 2?",
  schema: z.object({ answer: z.number() }),
})
// result: { answer: 4 }
```
