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
              // Allow self-hosted scripts and necessary JavaScript evaluation
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:;",
              // Allow styles from our domain and inline styles (needed for shadcn/ui and Tailwind)
              "style-src 'self' 'unsafe-inline';",
              // Allow images from our domain, data URIs, and udea.edu.co subdomains
              "img-src 'self' data: https://*.udea.edu.co blob:;",
              // Allow fonts from our domain and data URIs
              "font-src 'self' data:;",
              // Allow connections to our domain and the API
              "connect-src 'self' https://api.udea.edu.co;",
              // Prevent embedding our site in frames
              "frame-ancestors 'none';",
              // Restrict form submissions to our domain
              "form-action 'self';",
              // Restrict base URI to our domain
              "base-uri 'self';",
              // Prevent object embedding
              "object-src 'none';",
              // Add upgrade-insecure-requests directive
              "upgrade-insecure-requests;",
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
