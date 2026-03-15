import { createBrowserClient } from "@supabase/ssr"
import { config } from "./config"

export function supabaseBrowserClient<Database>() {
	let client: ReturnType<typeof createBrowserClient<Database>> | null = null

	const {
		supabase: { url, publishableKey },
	} = config()

	if (!client) client = createBrowserClient<Database>(url, publishableKey)

	return client
}
