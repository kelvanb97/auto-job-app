import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const env = createEnv({
	shared: {
		NEXT_PUBLIC_SUPABASE_URL: z.string().trim().url(),
		NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().trim().min(1),
	},
	server: {
		SUPABASE_SECRET_KEY: z.string().trim().min(1),
	},
	runtimeEnv: {
		NEXT_PUBLIC_SUPABASE_URL: process.env["NEXT_PUBLIC_SUPABASE_URL"],
		NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
			process.env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"],
		SUPABASE_SECRET_KEY: process.env["SUPABASE_SECRET_KEY"],
	},
})

type Config = {
	readonly supabase: {
		readonly url: string
		readonly publishableKey: string
		readonly secretKey: string
	}
}

const createConfig = (): Config => {
	const isServer = typeof window === "undefined"
	const secretKey = isServer ? env.SUPABASE_SECRET_KEY : ""
	return {
		supabase: {
			url: env.NEXT_PUBLIC_SUPABASE_URL,
			publishableKey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
			secretKey,
		},
	} as const
}

let _config: Config | null = null

export const config = () => {
	if (!_config) _config = createConfig()
	return _config
}
