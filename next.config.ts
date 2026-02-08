import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: process.env.NODE_ENV === "development" ? [
    process.env.NGROK_URL || "http://localhost:3000"
  ] : []
};

export default nextConfig;
