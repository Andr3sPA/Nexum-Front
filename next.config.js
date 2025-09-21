/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce build verbosity
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
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

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure webpack for better compatibility
  webpack: (config, { dev, isServer }) => {
    // Soporte para importar SVGs como componentes React
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.[jt]sx?$/] },
      use: [
        {
          loader: require.resolve("@svgr/webpack"),
          options: {
            icon: true,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "removeViewBox",
                  active: false,
                },
              ],
            },
          },
        },
      ],
    });
    return config;
  },
  // Add security headers via next.config.js as backup
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "connect-src 'self' http://localhost:8100/nexum/v1/ http://localhost:8110/nexum/v1/ http://localhost:8120/nexum/v1/ ws: wss: http://localhost:8110 http://localhost:8100 http://localhost:3000 http://localhost:8120;",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
