import { AppShell } from "#templates/app-shell"
import { PeopleTemplate } from "#templates/people-template"

export async function PeopleScreen() {
	return (
		<AppShell activePage="people">
			<PeopleTemplate />
		</AppShell>
	)
}
