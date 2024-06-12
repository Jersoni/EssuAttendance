// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add your custom configurations here
  reactStrictMode: true, // Enables stricter React checks
  swcMinify: true, // Enables SWC for minification during production builds
  images: {
    domains: [''], // Allows images from specific domains
  },
  // ... other configurations
};

export default nextConfig;
