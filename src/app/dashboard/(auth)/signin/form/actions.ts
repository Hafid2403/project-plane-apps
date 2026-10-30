"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { APIError } from "better-auth/api";
import { formSchema } from "./validation";
import { auth } from "@/lib/auth";

export interface ActionResult {
	errorTitle: string | null;
	errorDesc: string[] | null;
}

export async function handleSignIn(
	prevState: unknown,
	formData: FormData
): Promise<ActionResult> {
	const values = formSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!values.success) {
		const errorDesc = values.error.issues.map((issue) => issue.message);

		return {
			errorTitle: "Error Validation",
			errorDesc,
		};
	}

	try {
		const result = await auth.api.signInEmail({
			body: {
				email: values.data.email,
				password: values.data.password,
			},
			headers: await headers(),
		});

		if ((result.user as { role?: string }).role !== "ADMIN") {
			await auth.api.signOut({ headers: await headers() });
			return {
				errorTitle: "Error",
				errorDesc: ["Akun ini bukan admin"],
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

	redirect("/dashboard");
}
