import "server-only"
import { CookieMethodsServer, createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { config } from "./config"

export const updateSession = async (
	request: Pick<NextRequest, "cookies" | "headers">,
): Promise<NextResponse> => {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	})
	const cookieMethods: CookieMethodsServer = {
		getAll() {
			return request.cookies.getAll()
		},
		setAll(cookiesToSet) {
			cookiesToSet.forEach(({ name, value }) =>
				request.cookies.set(name, value),
			)
			response = NextResponse.next({ request })
			cookiesToSet.forEach(({ name, value, options }) =>
				response.cookies.set(name, value, options),
			)
		},
	}

	const {
		supabase: { url, publishableKey },
	} = config()
	const supabase = createServerClient(url, publishableKey, {
		cookies: cookieMethods,
	})
	await supabase.auth.getUser()

	return response
}
