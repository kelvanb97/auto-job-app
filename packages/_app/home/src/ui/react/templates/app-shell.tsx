"use client"

import { cn } from "@rja-design/ui/cn"
import { XStack } from "@rja-design/ui/primitives/x-stack"
import { YStack } from "@rja-design/ui/primitives/y-stack"
import { Sidebar } from "#organisms/sidebar"
import { TopBar } from "#organisms/top-bar"

export type TPage = "dashboard" | "roles" | "create" | "settings" | "llm-config"

interface IAppShellProps {
	activePage: TPage
	ignoreMainPadding?: boolean
	children: React.ReactNode
}

export function AppShell({
	activePage,
	ignoreMainPadding = false,
	children,
}: IAppShellProps) {
	return (
		<XStack className="h-screen overflow-hidden">
			<Sidebar activePage={activePage} />
			<YStack className="flex-1 overflow-hidden">
				<TopBar activePage={activePage} />
				<main
					className={cn(
						"flex-1 overflow-y-auto",
						!ignoreMainPadding && "p-6",
					)}
				>
					{children}
				</main>
			</YStack>
		</XStack>
	)
}
