/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'i.pngimg.me',
          }
        ]
      }
}

module.exports = nextConfig
