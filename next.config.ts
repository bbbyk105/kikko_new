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
    const canonicalHost = ["www.worxmtfuji.com", "worksmtfuji.com", "www.worksmtfuji.com"].flatMap(
      (host) => {
        const has = [{ type: "host" as const, value: host.replaceAll(".", "\\.") }];
        return [
          { source: "/", has, destination: "https://worxmtfuji.com/", permanent: true },
          { source: "/:path*", has, destination: "https://worxmtfuji.com/:path*", permanent: true },
        ];
      },
    );
    // 管理画面は /admin/reservations だけなので、/admin を開いたらそこへ送る
    return [
      ...canonicalHost,
      { source: "/admin", destination: "/admin/reservations", permanent: false },
    ];
  },
};

export default nextConfig;
