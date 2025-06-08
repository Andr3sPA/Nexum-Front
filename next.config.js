/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress development logs and output
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Disable telemetry completely
  telemetry: false,
  // Reduce build verbosity
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Experimental features for cleaner output
  experimental: {
    logging: {
      level: "error",
    },
  },
  // Optimize for development
  swcMinify: true,
  // Image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Disable source maps in development for cleaner output
  productionBrowserSourceMaps: false,
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
