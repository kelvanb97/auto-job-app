import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	// NOTE: This is required to support PostHog trailing slash API requests
	skipTrailingSlashRedirect: true,
	transpilePackages: ["@aja-design/ui", "@aja-app/scraper", "@aja-app/score"],
	serverExternalPackages: ["patchright", "patchright-core"],
}

export default nextConfig
