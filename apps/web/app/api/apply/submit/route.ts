import { submitApplication } from "@aja-app/apply/submit-application"
import { NextResponse } from "next/server"

export async function PATCH(request: Request) {
	try {
		const body = (await request.json()) as {
			applicationId: string
			roleId: string
		}

		if (!body.applicationId || !body.roleId) {
			return NextResponse.json(
				{ error: "applicationId and roleId are required" },
				{ status: 400 },
			)
		}

		const result = await submitApplication({
			applicationId: body.applicationId,
			roleId: body.roleId,
		})

		if (!result.ok) {
			return NextResponse.json(
				{ error: result.error.message },
				{ status: 500 },
			)
		}

		return NextResponse.json({ ok: true })
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err)
		return NextResponse.json({ error: message }, { status: 500 })
	}
}
