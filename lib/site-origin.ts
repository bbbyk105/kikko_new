import "server-only";
import { headers } from "next/headers";
import { siteConfig } from "@/app/data/site";

/**
 * メールに載せる URL の起点。本番は正規ドメイン固定（Host ヘッダーを信用しない）。
 * 開発中は今開いているホスト（localhost:3000 など）にする。
 */
export async function siteOrigin(): Promise<string> {
  if (process.env.NODE_ENV === "production") return siteConfig.url;
  const host = (await headers()).get("host");
  return host ? `http://${host}` : siteConfig.url;
}
