import withPWAInit from 'next-pwa'
import { createConfiguration } from 'next-pwa/cache'

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'service-worker.js',
})

export default withPWA({
  reactStrictMode: true,
  swcMinify: true,
  experimental: { serverComponentsExternalPackages: ['@react-pdf/renderer'] }
})