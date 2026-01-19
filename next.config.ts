import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. PERFORMANCE: Ensure minification is active
  swcMinify: true,

  // 2. IMAGES
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ichef.bbci.co.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.hindustantimes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'openweathermap.org',
        port: '',
        pathname: '/img/wn/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'googleusercontent.com',
        pathname: '/**',
      },
    ],
  },

  // 3. EXPERIMENTAL
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // 4. LINTING & TYPESCRIPT
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 5. WEBPACK OVERRIDE (The "Nuclear Option" to block polyfills)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      if (config.resolve && config.resolve.alias) {
        // Forcefully resolve bloat libraries to false
        config.resolve.alias['core-js'] = false;
        config.resolve.alias['regenerator-runtime'] = false;
      }
    }
    return config;
  },
};

export default nextConfig;