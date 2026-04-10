import { cn } from "#utils/cn"

interface IInputLabelWrapperProps {
	className?: string
	children: React.ReactNode
}

export function InputLabelWrapper({
	children,
	className,
}: IInputLabelWrapperProps) {
	return <div className={cn("grid gap-1", className)}>{children}</div>
}
