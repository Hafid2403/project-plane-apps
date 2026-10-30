"use server";

import type { ActionResult } from "@/app/dashboard/(auth)/signin/form/actions";
import { userSchema } from "./validation";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function signUpUser(
	prevState: unknown,
	formData: FormData
): Promise<ActionResult> {
	const validate = userSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
		passport: formData.get("passport"),
	});

	if (!validate.success) {
		const errorDesc = validate.error.issues.map((issue) => issue.message);

		return {
			errorTitle: "Error Validation",
			errorDesc,
		};
	}

	const existingUser = await prisma.user.findUnique({
		where: { email: validate.data.email },
		select: { id: true },
	});

	if (existingUser) {
		return {
			errorTitle: "Gagal mendaftar",
			errorDesc: ["Email sudah terdaftar"],
		};
	}

	try {
		await auth.api.signUpEmail({
			body: {
				name: validate.data.name,
				email: validate.data.email,
				password: validate.data.password,
				passport: validate.data.passport,
			},
		});
	} catch (error) {
		if (error instanceof APIError) {
			return {
				errorTitle: "Gagal mendaftar",
				errorDesc: [error.message],
			};
		}
		throw error;
	}

	redirect("/sign-in");
}
