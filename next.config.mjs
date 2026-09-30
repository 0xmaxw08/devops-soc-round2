/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {                                                                                    
    ignoreBuildErrors: true,
  },
  output: 'standalone', // Moved out to the root object
  images: {
    unoptimized: true,
  },
}

export default nextConfig

