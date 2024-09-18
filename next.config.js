/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Dodano reactStrictMode
  typescript: {  ignoreBuildErrors: true,},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Konfiguracja dla Cloudinary
      },
      {
        protocol: 'http',
        hostname: 'localhost', // Konfiguracja dla lokalnego serwera
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc', // Konfiguracja dla Postimg
      },
    ],
  },
  // Usunięto klucz `api`, ponieważ nie jest obsługiwany w App Routerze
};

module.exports = nextConfig;
