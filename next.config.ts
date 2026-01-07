import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // This allows all paths under the hostname
      },
      // Add this new pattern for BBC images
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
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase the limit to 10 megabytes
    },
  },
  
};

export default nextConfig;
