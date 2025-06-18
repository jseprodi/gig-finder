import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["assets-us-01.kc-usercontent.com"],
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default nextConfig;
