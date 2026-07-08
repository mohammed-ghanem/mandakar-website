import type { NextConfig } from "next";
import path from "path";

const canvasStub = path.join(process.cwd(), "lib/empty-canvas-stub.js");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backend-academy.sorooj.org",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: canvasStub,
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      canvas: "./lib/empty-canvas-stub.js",
    },
  },
};

export default nextConfig;
