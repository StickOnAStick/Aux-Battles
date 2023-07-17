/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  images: {
    domains: ["api.aux-battles.app", "localhost", "127.0.0.1"],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '443',
        pathname: '/api/files/**'
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**'
      }
    ]
  },
  env: {
    POCKETBASE_URL: process.env.POCKETBASE_URL,
    SOCKET_IO_URL: process.env.SOCKET_IO_URL,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    VERCEL_URL: process.env.VERCEL_URL
  }
}

module.exports = nextConfig
