import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import { brandWithReading, siteConfig } from "@/app/data/site";
import { homeDescription, homeTitle } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  // 各ページは title に「料金プラン」などだけを書く
  title: {
    default: homeTitle,
    template: `%s | ${brandWithReading}`,
  },
  description: homeDescription,
  keywords: [
    "きっこうどう",
    "橘香堂",
    "コワーキングスペース",
    "レンタルスペース",
    "富士市",
    "吉原",
    "ワークスペース",
    "シェアオフィス",
    "会議室",
    "静岡県",
    "近藤薬局",
    "worx mt.fuji",
  ],
  // og:title・og:description はここで固定しない（固定するとどのページを共有してもトップの内容になる）。
  // 各ページの title・description が使われる。画像は app/opengraph-image.jpg
  openGraph: {
    siteName: `${brandWithReading} (${siteConfig.nameEn})`,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-scroll-behavior="smooth">
      <body
        className={`${cormorant.variable} ${notoSansJP.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
