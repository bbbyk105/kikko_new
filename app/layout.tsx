import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
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
  title: "橘香堂 (worx mt.fuji) | 富士市吉原のコワーキングスペース",
  description:
    "静岡県富士市吉原の静かで上質なワークスペース。高速Wi-Fi、住所登録、会議室完備。起業家、フリーランス、リモートワーカーのための集中できる空間。",
  keywords: [
    "コワーキングスペース",
    "富士市",
    "吉原",
    "ワークスペース",
    "シェアオフィス",
    "会議室",
    "静岡県",
  ],
  openGraph: {
    title: "橘香堂 (worx mt.fuji) | 富士市吉原のコワーキングスペース",
    description:
      "静岡県富士市吉原の静かで上質なワークスペース。高速Wi-Fi、住所登録、会議室完備。",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${cormorant.variable} ${notoSansJP.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
