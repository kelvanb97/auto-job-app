"use client"

import type { TCompany } from "@aja-api/company/schema/company-schema"
import type { TRole } from "@aja-api/role/schema/role-schema"
import {
	useAction,
	useActionError,
	useIsLoading,
	useToastOnError,
} from "@aja-core/next-safe-action/hooks"
import { Button } from "@aja-design/ui/library/button"
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@aja-design/ui/library/dialog"
import { toast } from "@aja-design/ui/library/toast"
import { YStack } from "@aja-design/ui/primitives/y-stack"
import { updateRoleWithCompanyAction } from "#actions/update-role-with-company"
import {
	CompanyFieldsCard,
	type ICompanyFieldsValues,
} from "#molecules/company-fields-card"
import {
	RoleFieldsCard,
	type IRoleFieldsValues,
} from "#molecules/role-fields-card"
import { useEffect, useState } from "react"

function roleToFieldValues(role: TRole): IRoleFieldsValues {
	return {
		title: role.title,
		url: role.url ?? "",
		description: role.description ?? "",
		source: role.source ?? "",
		locationType: role.locationType ?? "",
		location: role.location ?? "",
		salaryMin: role.salaryMin?.toString() ?? "",
		salaryMax: role.salaryMax?.toString() ?? "",
		notes: role.notes ?? "",
	}
}

function companyToFieldValues(company: TCompany | null): ICompanyFieldsValues {
	return {
		name: company?.name ?? "",
		website: company?.website ?? "",
		linkedinUrl: company?.linkedinUrl ?? "",
		size: company?.size ?? "",
		stage: company?.stage ?? "",
		industry: company?.industry ?? "",
		notes: company?.notes ?? "",
	}
}

interface IEditRoleDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	role: TRole | null
	company: TCompany | null
	onSaved: (role: TRole) => void
}

export function EditRoleDialog({
	open,
	onOpenChange,
	role,
	company,
	onSaved,
}: IEditRoleDialogProps) {
	const [roleFields, setRoleFields] = useState<IRoleFieldsValues>(
		roleToFieldValues(role ?? ({ title: "" } as TRole)),
	)
	const [companyFields, setCompanyFields] = useState<ICompanyFieldsValues>(
		companyToFieldValues(company),
	)

	useEffect(() => {
		if (role) setRoleFields(roleToFieldValues(role))
		setCompanyFields(companyToFieldValues(company))
	}, [role, company])

	const { execute, result, status } = useAction(updateRoleWithCompanyAction, {
		onSuccess: ({ data }) => {
			if (data) {
				toast.success("Role updated!")
				onSaved(data)
				onOpenChange(false)
			}
		},
	})

	const error = useActionError(result)
	useToastOnError(error, status)
	const isLoading = useIsLoading(status)

	const handleSave = () => {
		if (!role) return

		const roleInput: Record<string, unknown> = { id: role.id }
		if (roleFields.title !== role.title)
			roleInput["title"] = roleFields.title
		if (roleFields.url !== (role.url ?? ""))
			roleInput["url"] = roleFields.url || null
		if (roleFields.description !== (role.description ?? ""))
			roleInput["description"] = roleFields.description || null
		if (roleFields.source !== (role.source ?? ""))
			roleInput["source"] = roleFields.source || null
		if (roleFields.locationType !== (role.locationType ?? ""))
			roleInput["locationType"] = roleFields.locationType || null
		if (roleFields.location !== (role.location ?? ""))
			roleInput["location"] = roleFields.location || null

		const newMin = roleFields.salaryMin
			? Number(roleFields.salaryMin)
			: null
		if (newMin !== role.salaryMin) roleInput["salaryMin"] = newMin
		const newMax = roleFields.salaryMax
			? Number(roleFields.salaryMax)
			: null
		if (newMax !== role.salaryMax) roleInput["salaryMax"] = newMax

		if (roleFields.notes !== (role.notes ?? ""))
			roleInput["notes"] = roleFields.notes || null

		const companyInput =
			company && companyFields.name.trim()
				? {
						id: company.id,
						name: companyFields.name,
						website: companyFields.website || null,
						linkedinUrl: companyFields.linkedinUrl || null,
						size: companyFields.size || null,
						stage: companyFields.stage || null,
						industry: companyFields.industry || null,
						notes: companyFields.notes || null,
					}
				: undefined

		execute({
			role: roleInput as { id: string },
			company: companyInput,
		})
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Role</DialogTitle>
				</DialogHeader>
				<YStack className="gap-6">
					<CompanyFieldsCard
						values={companyFields}
						onChange={setCompanyFields}
					/>
					<RoleFieldsCard
						values={roleFields}
						onChange={setRoleFields}
					/>
				</YStack>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={isLoading}>
						{isLoading ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
