# @rja-integrations/anthropic

Thin wrapper around the Anthropic SDK for structured message creation. Normally consumed via `@rja-integrations/llm`, which dispatches to this package based on the user's configured provider.

## Exports

### `createMessage<T>(params)`

Sends a single user message to the Anthropic API and parses the response against a Zod schema using tool-use for structured output. The caller is responsible for supplying `apiKey` and `model` — this package does not read from environment variables. In this repo, the API key and model come from the user's `llm_config` row via `@rja-api/settings`.

```typescript
import { getLlmConfigForUseCase } from "@rja-api/settings/api/get-llm-config-for-use-case"
import { createMessage } from "@rja-integrations/anthropic/client"
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
