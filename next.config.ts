import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  async redirects() {
    // 正規ドメイン以外は worxmtfuji.com へ（worksmtfuji.com は綴り違い対策で保持）
    return ["www.worxmtfuji.com", "worksmtfuji.com", "www.worksmtfuji.com"].map(
      (host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host.replaceAll(".", "\\.") }],
        destination: "https://worxmtfuji.com/:path*",
        permanent: true,
      }),
    );
  },
};

export default nextConfig;
