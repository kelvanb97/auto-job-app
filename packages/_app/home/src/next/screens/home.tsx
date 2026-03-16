import { AppShell } from "#templates/app-shell"
import { HomeTemplate } from "#templates/home-template"

export async function HomeScreen() {
	return (
		<AppShell activePage="dashboard">
			<HomeTemplate />
		</AppShell>
	)
}
