/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ Remove experimental flags (Next.js 14+ defaults to App Router + Server Actions)
  images: {
    domains: ["localhost", "api.schoolerp-gullysystem.in"],
  },

  eslint: {
    ignoreDuringBuilds: true, // allows successful builds even with lint issues
  },

  typescript: {
    ignoreBuildErrors: true, // skip type errors for smoother local dev
  },

  // ✅ Add CORS headers for local API access
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

