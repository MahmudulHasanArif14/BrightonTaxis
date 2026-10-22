import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The landing page's background and vehicle imagery is hosted on
    // Unsplash. Blog article images come from the central content platform and
    // are rendered with a plain <img>, because that set of hostnames is not
    // known at build time -- see app/blog/page.tsx.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
