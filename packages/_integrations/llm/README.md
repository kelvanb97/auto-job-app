# @rja-integrations/llm

Provider-agnostic LLM abstraction. Dispatches `createMessage` calls to the right provider package (`@rja-integrations/anthropic` or `@rja-integrations/openai`) based on a runtime `TLlmConfig`.

## Exports

### `createMessage<T>(config, params)`

```typescript
import { createMessage } from "@rja-integrations/llm/client"
import { z } from "zod"

const result = await createMessage(
    {
        provider: "anthropic", // or "openai"
        apiKey: "sk-...",
        model: "claude-haiku-4-5",
    },
    {
        system: "You are a helpful assistant.",
        user: "What is 2 + 2?",
        schema: z.object({ answer: z.number() }),
    },
)
// result: { answer: 4 }
```

### Types

- `TLlmProvider` — `"anthropic" | "openai"`
- `TLlmConfig` — `{ provider, apiKey, model }`
- `LLM_PROVIDERS` — as-const array of supported providers
