import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Job posts carry up to 6 photos at 5 MB each.
    serverActions: { bodySizeLimit: "32mb" },
  },
};

export default nextConfig;
