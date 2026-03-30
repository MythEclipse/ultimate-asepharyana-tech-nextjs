import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'otakudesu.cam' },
      { protocol: 'https', hostname: 'i0.wp.com' },
      { protocol: 'https', hostname: 'i1.wp.com' },
      { protocol: 'https', hostname: 'i2.wp.com' },
      { protocol: 'https', hostname: 'i3.wp.com' },
      { protocol: 'https', hostname: 'alqanime.net' },
      { protocol: 'https', hostname: 'rekomik.com' },
      { protocol: 'https', hostname: 'static.rekomik.com' },
      { protocol: 'https', hostname: 'tsumugu.rekomik.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  transpilePackages: [
    '@tsparticles/react',
    '@tsparticles/slim',
    'three',
  ],
} satisfies NextConfig;

export default nextConfig;
