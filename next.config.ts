import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Google S2 Favicon API — logo'lar için kullanılıyor
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/favicons**" },
    ],
  },
};

export default nextConfig;
