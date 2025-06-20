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
  // Image optimization - FIXED SECURITY ISSUE

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
  // Add security headers via next.config.js as backup
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
