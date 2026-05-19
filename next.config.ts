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
    // Only mixins — tokens have :root/:data-theme global selectors that break CSS Modules purity check
    additionalData: `@use '@/styles/mixins' as *;`,
  },
};

export default nextConfig;
