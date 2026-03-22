import { AppShell } from "#templates/app-shell"
import { OperationsTemplate } from "#templates/operations-template"

export async function OperationsScreen() {
	return (
		<AppShell activePage="operations">
			<OperationsTemplate />
		</AppShell>
	)
}
