// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'deisishop.pythonanywhere.com',
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

module.exports = nextConfig;