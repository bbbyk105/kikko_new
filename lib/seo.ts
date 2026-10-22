import type { Metadata } from "next";
import { brandWithReading } from "@/app/data/site";

/** トップのタイトル。読みを前に置き、地域と業種が続く */
export const homeTitle = `${brandWithReading} | 富士市吉原のコワーキング・レンタルスペース`;

export const homeDescription = `${brandWithReading}は、静岡県富士市吉原のコワーキング・レンタルスペース。高速Wi-Fi、住所登録、会議室、貸切に対応。起業家、フリーランス、リモートワーカーのための集中できる空間。`;

/** 各ページの title・description・自己参照 canonical・og:url。title にはルートの template が付く */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { url: path },
  };
}

export const homeMetadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};
