import { pricingPlans, siteConfig } from "@/app/data/site";

/** Google マップの埋め込み URL（!2d経度!3d緯度）から座標を取り出す。取れなければ null */
export function coordinatesFromMapsEmbed(embedUrl: string): { latitude: number; longitude: number } | null {
  const lng = embedUrl.match(/!2d(-?\d+(?:\.\d+)?)/)?.[1];
  const lat = embedUrl.match(/!3d(-?\d+(?:\.\d+)?)/)?.[1];
  if (!lng || !lat) return null;
  return { latitude: Number(Number(lat).toFixed(6)), longitude: Number(Number(lng).toFixed(6)) };
}

/** 「〒417-0051」→「417-0051」 */
function postalCode(): string {
  return siteConfig.address.postal.replace(/^〒/, "");
}

/** 「静岡県富士市吉原2丁目8番21-2号」を都道府県・市区町村・番地に分ける */
export function splitJapaneseAddress(full: string): { region: string; locality: string; street: string } {
  const m = full.match(/^(.+?[都道府県])(.+?[市区町村])(.+)$/);
  return m ? { region: m[1], locality: m[2], street: m[3] } : { region: "", locality: "", street: full };
}

/**
 * トップページに出す構造化データ（店舗情報とサイト名）。
 * 住所・電話・営業時間などを検索エンジンに正確に伝え、地域の検索や Google マップとの結び付きに使われる。
 * 値はすべて siteConfig などサイトに載っている情報から作る（別の数字を書かない）。
 */
export function homeStructuredData() {
  const address = splitJapaneseAddress(siteConfig.address.full);
  const geo = coordinatesFromMapsEmbed(siteConfig.googleMapsEmbed);
  const lowestPrice = pricingPlans[0]?.price;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${siteConfig.url}/#business`,
        name: siteConfig.officialName,
        alternateName: [siteConfig.name, siteConfig.nameEn],
        description: `${siteConfig.description}コワーキング、会議室、住所登録、貸切イベントに対応。`,
        url: siteConfig.url,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        image: [`${siteConfig.url}/opengraph-image.jpg`, `${siteConfig.url}/images/slide1.webp`],
        address: {
          "@type": "PostalAddress",
          postalCode: postalCode(),
          addressRegion: address.region,
          addressLocality: address.locality,
          streetAddress: address.street,
          addressCountry: "JP",
        },
        ...(geo ? { geo: { "@type": "GeoCoordinates", ...geo } } : {}),
        hasMap: siteConfig.googleMapsLink,
        // 営業時間は「平日・土日祝 9:00–18:00」（siteConfig.hours）
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "09:00",
            closes: "18:00",
          },
        ],
        ...(lowestPrice ? { priceRange: `${lowestPrice}〜` } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: `${siteConfig.name} (${siteConfig.nameEn})`,
        alternateName: [siteConfig.nameEn, siteConfig.name],
        url: `${siteConfig.url}/`,
        inLanguage: "ja",
        publisher: { "@id": `${siteConfig.url}/#business` },
      },
    ],
  };
}
