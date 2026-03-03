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
  
  // Enable Turbopack for Next.js 16
  turbopack: {},
  
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
};

export default nextConfig;
