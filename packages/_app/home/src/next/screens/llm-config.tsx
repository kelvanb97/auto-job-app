import { getLlmConfig } from "@rja-api/settings/api/get-llm-config"
import { AppShell } from "#templates/app-shell"
import { LlmConfigTemplate } from "#templates/llm-config-template"

export async function LlmConfigScreen() {
	const llmResult = getLlmConfig()

	return (
		<AppShell activePage="llm-config">
			<LlmConfigTemplate llm={llmResult.ok ? llmResult.data : null} />
		</AppShell>
	)
}
