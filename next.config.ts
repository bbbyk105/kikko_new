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
    // トップページは別ルールにする。OpenNext は "/:path*" が "/" にマッチすると
    // ":path*" を置き換えず、https://worxmtfuji.com/:path* へ飛ばしてしまうため。
    return ["www.worxmtfuji.com", "worksmtfuji.com", "www.worksmtfuji.com"].flatMap(
      (host) => {
        const has = [{ type: "host" as const, value: host.replaceAll(".", "\\.") }];
        return [
          { source: "/", has, destination: "https://worxmtfuji.com/", permanent: true },
          { source: "/:path*", has, destination: "https://worxmtfuji.com/:path*", permanent: true },
        ];
      },
    );
  },
};

export default nextConfig;
