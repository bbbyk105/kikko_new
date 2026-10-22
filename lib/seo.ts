import type { Metadata } from "next";
import { brandWithReading, siteConfig } from "@/app/data/site";

/**
 * サイト内パスを絶対 URL にする。
 * トップ（"/"）は末尾スラッシュなし。sitemap、robots の Sitemap、パンくず JSON-LD の item で使う。
 */
export function absoluteUrl(path: string): string {
  if (path === "/") return siteConfig.url;
  return new URL(path, `${siteConfig.url}/`).toString();
}

/** トップのタイトル。読みを前に置き、地域と業種が続く */
export const homeTitle = `${brandWithReading} | 富士市吉原のコワーキング・レンタルスペース`;

export const homeDescription = `${brandWithReading}は、静岡県富士市吉原のコワーキング・レンタルスペース。高速Wi-Fi、住所登録、会議室、貸切に対応。起業家、フリーランス、リモートワーカーのための集中できる空間。`;

/**
 * 各ページの title・description・自己参照 canonical。
 * title にはルートの template が付く。
 * og:url はルートの openGraph.url（"./"）が今のページのパスになる。
 * ここで openGraph を書くと、app/opengraph-image.jpg が外れる。
 */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
  };
}

export const homeMetadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: "/" },
};
