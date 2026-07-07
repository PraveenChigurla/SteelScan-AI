import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production';
    const apiUrl = isProd 
      ? "https://steel-fault-classifier.onrender.com" 
      : "http://127.0.0.1:8000";
      
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
