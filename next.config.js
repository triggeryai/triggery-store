// next-amazona-v2/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Existing configuration for Cloudinary
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Existing configuration for local server
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc', // Added configuration for Postimg
      },
    ],
  },
  api: {
    bodyParser: {
      sizeLimit: '50mb', // Set the maximum upload size to 50MB
    },
  },
};

module.exports = nextConfig;
