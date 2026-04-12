import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	// NOTE: This is required to support PostHog trailing slash API requests
	skipTrailingSlashRedirect: true,
	transpilePackages: ["@rja-design/ui"],
	serverExternalPackages: [
		"patchright",
		"patchright-core",
		"better-sqlite3",
		"@rja-core/drizzle",
		"pdf-parse",
	],
}

export default nextConfig
