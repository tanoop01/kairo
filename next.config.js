/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'supabase.co',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  
  // Optimize fonts
  optimizeFonts: true,
}

module.exports = nextConfig
