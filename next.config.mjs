/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.supabase.co",
			},
		],
		unoptimized: true,
	},
	serverExternalPackages: ["pg", "@prisma/adapter-pg"],
};

export default nextConfig;
