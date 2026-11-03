
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async rewrites() {
    const API_URL = process.env.API_URL;

    if (!API_URL) {
      throw new Error("API_URL environment variable is missing");
    }

    return [
      {
        source: "/api/server-auth/:path*",
        destination: `${API_URL}/api/auth/:path*`,
      },
      {
        source: "/api/studios/:path*",
        destination: `${API_URL}/api/studios/:path*`,
      },
      {
        source: "/api/studios",
        destination: `${API_URL}/api/studios`,
      },
      {
        source: "/api/bookings/:path*",
        destination: `${API_URL}/api/bookings/:path*`,
      },
      {
        source: "/api/bookings",
        destination: `${API_URL}/api/bookings`,
      },
      {
        source: "/api/wishlist/:path*",
        destination: `${API_URL}/api/wishlist/:path*`,
      },
    ];
  },
};

export default nextConfig;
