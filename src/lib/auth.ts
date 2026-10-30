import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { cache } from "react";
import prisma from "./prisma";

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL,
	secret: process.env.BETTER_AUTH_SECRET,
	database: prismaAdapter(prisma, { provider: "postgresql" }),
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 4,
		autoSignIn: false,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "CUSTOMER",
				input: false,
			},
			passport: {
				type: "string",
				required: false,
			},
		},
	},
	// nextCookies wajib paling akhir agar cookie sesi tersimpan dari server action
	plugins: [nextCookies()],
});

type AuthSession = typeof auth.$Infer.Session;

export type User = Omit<AuthSession["user"], "role" | "passport"> & {
	role: "CUSTOMER" | "ADMIN";
	passport: string | null;
};
export type Session = AuthSession["session"];

/**
 * Pengganti getUser() milik Lucia. Bentuk return sama:
 * { user, session } atau { user: null, session: null }.
 */
export const getUser = cache(
	async (): Promise<
		{ user: User; session: Session } | { user: null; session: null }
	> => {
		const result = await auth.api.getSession({ headers: await headers() });

		if (!result) {
			return { user: null, session: null };
		}

		return {
			user: {
				...result.user,
				role: (result.user.role ?? "CUSTOMER") as User["role"],
				passport: result.user.passport ?? null,
			},
			session: result.session,
		};
	}
);
