import { AppShell } from "#templates/app-shell"
import { CreateTemplate } from "#templates/create-template"

export async function CreateScreen() {
	return (
		<AppShell activePage="create">
			<CreateTemplate />
		</AppShell>
	)
}
