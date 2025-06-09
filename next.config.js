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
  
  // Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval';", // Consider restricting further in production
              "style-src 'self' 'unsafe-inline';", // Required for styled-components/emotion
              "img-src 'self' data: https://*.udea.edu.co;",
              "font-src 'self' data:;",
              "connect-src 'self' https://api.udea.edu.co;",
              "frame-ancestors 'none';",
              "form-action 'self';",
              "base-uri 'self';",
            ].join(' ')
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig
