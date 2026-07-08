import type { NextConfig } from "next";

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
};

export default nextConfig;




// import type { NextConfig } from "next";
// import path from "path";

// const canvasStub = "./lib/empty-canvas-stub.js";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "backend-academy.sorooj.org",
//       },
//       {
//         protocol: "https",
//         hostname: "img.youtube.com",
//       },
//     ],
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   webpack: (config) => {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       canvas: path.resolve(canvasStub),
//     };
//     return config;
//   },
//   turbopack: {
//     resolveAlias: {
//       canvas: canvasStub,
//     },
//   },
// };

// export default nextConfig;
