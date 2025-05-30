import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "randomuser.me",
      "bongsrey.sgp1.digitaloceanspaces.com",
      "img.clerk.com",
      "in0jelheh3pnxjxi.public.blob.vercel-storage.com"
    ],
   
  dangerouslyAllowSVG: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    unoptimized: false,
  },
  experimental: {
    dynamicIO: true,
    authInterrupts: true,
    serverActions: {
      bodySizeLimit: '4mb'
    },
  },
};

export default nextConfig;
