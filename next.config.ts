import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable strict mode for better compatibility
  reactStrictMode: false,
  
  // Allowed origins for development
  allowedDevOrigins: [
    'localhost',
    '.space.z.ai',
    '.z.ai',
    '.deeptech-ai.co.uk',
  ],
  
  // Ensure static files are properly served
  generateEtags: true,
  
  // Cache control for static assets
  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  
  // Webpack configuration for better chunk handling
  webpack: (config, { isServer }) => {
    // Fix for npm packages that use 'fs' module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
