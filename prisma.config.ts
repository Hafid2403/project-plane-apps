import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
		seed: "tsx prisma/seed.ts",
	},
	datasource: {
		// CLI (migrate, studio, seed) memakai koneksi direct bila ada.
		url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
	},
});
