import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/future-legend-dev',
  assetPrefix: '/future-legend-dev/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  sassOptions: {
    additionalData: `@use '@/styles/tokens' as *; @use '@/styles/mixins' as *;`,
  },
};

export default nextConfig;
