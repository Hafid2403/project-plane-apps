"use server";

import type { ActionResult } from "@/app/dashboard/(auth)/signin/form/actions";
import { userSchema } from "../../sign-up/lib/validation";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInUser(
	prevState: unknown,
	formData: FormData
): Promise<ActionResult> {
	const signInSchema = userSchema.pick({ email: true, password: true });

	const validate = signInSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!validate.success) {
		const errorDesc = validate.error.issues.map((issue) => issue.message);

		return {
			errorTitle: "Error Validation",
			errorDesc,
		};
	}

	try {
		const result = await auth.api.signInEmail({
			body: {
				email: validate.data.email,
				password: validate.data.password,
			},
			headers: await headers(),
		});

		if ((result.user as { role?: string }).role !== "CUSTOMER") {
			await auth.api.signOut({ headers: await headers() });
			return {
				errorTitle: "Error",
				errorDesc: ["Akun admin silakan login lewat /dashboard/signin"],
			};
		}
	} catch (error) {
		if (error instanceof APIError) {
			return {
				errorTitle: "Error",
				errorDesc: ["Email / Password salah"],
			};
		}
		throw error;
	}

	redirect("/");
}
