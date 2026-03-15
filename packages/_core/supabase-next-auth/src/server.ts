import "server-only"
import { CookieMethodsServer, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import { config } from "./config"

export const supabaseServerClient = cache(async <Database>() => {
	const cookieStore = await cookies()
	const cookieMethods: CookieMethodsServer = {
		getAll: () => cookieStore.getAll(),

		setAll(cookiesToSet) {
			try {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookieStore.set(name, value, options)
				})
			} catch {
				// Do nothing!
				// https://supabase.com/docs/guides/auth/server-side/creating-a-client
			}
		},
	}

	const isLocal = process.env["NODE_ENV"] === "development"

	const {
		supabase: { url, secretKey },
	} = config()
	return createServerClient<Database>(url, secretKey, {
		cookies: cookieMethods,
		cookieOptions: {
			name: "sb-127-auth-token",
			domain: isLocal ? "localhost" : ".aja.com",
			sameSite: "none",
			secure: true,
			path: "/",
		},
	})
})

export const getUser = cache(async () => {
	const supabase = await supabaseServerClient()
	const { data } = await supabase.auth.getUser()
	return data.user
})

export const getUserAuthState = async (
	user: Awaited<ReturnType<typeof getUser>>,
): Promise<"Anonymous" | "Unverified" | "Verified"> => {
	if (!user) return "Anonymous"
	return user.email_confirmed_at ? "Verified" : "Unverified"
}

export const redirectUnverifiedUser = async () => {
	const user = await getUser()
	const userAuthState = await getUserAuthState(user)
	if (userAuthState === "Anonymous" || userAuthState === "Unverified")
		redirect("/")
}

export const redirectVerifiedUser = async () => {
	const user = await getUser()
	const userAuthState = await getUserAuthState(user)
	if (userAuthState === "Verified") redirect("/dashboard")
}

export const signOut = async () => {
	const supabase = await supabaseServerClient()
	const { error } = await supabase.auth.signOut()
	if (error) {
		//TODO: sentry or other error tracking
		console.error("Failed to sign out:", error)
	}
}
