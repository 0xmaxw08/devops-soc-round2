/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {                                                                                    
    ignoreBuildErrors: true,
  },
  
  // FIX: Disable standalone ONLY when building inside a Vercel-like tracing environment
  output: process.env.VERCEL || process.env.NEXT_PRIVATE_TARGET === 'vercel' ? undefined : 'standalone',
  
  images: {
    unoptimized: true,
  },
}

export default nextConfig

