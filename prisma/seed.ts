import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
		connectionTimeoutMillis: 15000,
	}),
});

async function main() {
	const email = "admin@mail.com";
	const password = "admin123";

	// Hash memakai fungsi bawaan Better Auth (scrypt), bukan bcrypt
	const hashed = await hashPassword(password);
	const userId = crypto.randomUUID();

	const admin = await prisma.user.upsert({
		where: { email },
		update: { role: "ADMIN" },
		create: {
			id: userId,
			email,
			name: "Admin",
			role: "ADMIN",
			emailVerified: true,
			accounts: {
				create: {
					id: crypto.randomUUID(),
					accountId: userId,
					providerId: "credential",
					password: hashed,
				},
			},
		},
	});

	console.log("Admin siap:", { email: admin.email, password, role: admin.role });
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
