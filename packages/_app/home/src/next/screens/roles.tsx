import { AppShell } from "#templates/app-shell"
import { RolesTemplate } from "#templates/roles-template"

export async function RolesScreen() {
	return (
		<AppShell activePage="roles">
			<RolesTemplate />
		</AppShell>
	)
}
