import { AppShell } from "#templates/app-shell"
import { FollowUpsTemplate } from "#templates/follow-ups-template"

export async function FollowUpsScreen() {
	return (
		<AppShell activePage="follow-ups">
			<FollowUpsTemplate />
		</AppShell>
	)
}
