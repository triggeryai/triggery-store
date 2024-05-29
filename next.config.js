/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Existing configuration
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Existing configuration
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc', // Added configuration
      },
    ],
  },
};

module.exports = nextConfig;
