import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "otakudesu.cam" },
      { hostname: "i0.wp.com" },
      { hostname: "i1.wp.com" },
      { hostname: "i2.wp.com" },
      { hostname: "alqanime.net" },
      { hostname: "rekomik.com" },
      { hostname: "static.rekomik.com" },
      { hostname: "tsumugu.rekomik.com" },
    ],
    unoptimized: true, // Optional fallback if scrapers block optimized requests
  },
};

export default nextConfig;
