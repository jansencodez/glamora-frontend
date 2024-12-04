import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "example.com"], // Add Cloudinary domain
  },
};

export default nextConfig;
