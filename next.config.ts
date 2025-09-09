import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Improve error handling
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  
  // Optimize for production
  poweredByHeader: false,
  
  // Better error handling for production
  experimental: {
    // Improve error reporting
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Handle environment variables safely
  env: {
    CUSTOM_NODE_ENV: process.env.NODE_ENV,
  },
  
  // Webpack configuration for better error handling
  webpack: (config, { isServer }) => {
    // Add better error handling for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  
  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"]
    } : false,
  },
  
  // Error handling
  async redirects() {
    return []
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
        ],
      },
    ]
  },
};

export default nextConfig;
