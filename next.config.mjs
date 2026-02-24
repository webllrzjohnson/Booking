/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
        'pg-native': 'commonjs pg-native',
        'pg-pool': 'commonjs pg-pool',
        'bcryptjs': 'commonjs bcryptjs',
      })
    }
    return config
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg', 'pg', 'pg-pool', 'bcryptjs'],
}

export default nextConfig
