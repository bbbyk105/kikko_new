import { coordinatesFromMapsEmbed, faqStructuredData, homeStructuredData, splitJapaneseAddress } from "@/lib/structured-data";

describe("coordinatesFromMapsEmbed", () => {
  it("埋め込み URL の !2d（経度）・!3d（緯度）から座標を取る", () => {
    expect(coordinatesFromMapsEmbed("https://www.google.com/maps/embed?pb=!1m18!2d138.68491027576485!3d35.16258317275916!2m3")).toEqual({
      latitude: 35.162583,
      longitude: 138.68491,
    });
  });
  it("座標がなければ null", () => {
    expect(coordinatesFromMapsEmbed("https://example.com")).toBeNull();
  });
});

describe("splitJapaneseAddress", () => {
  it("都道府県・市区町村・番地に分ける", () => {
    expect(splitJapaneseAddress("静岡県富士市吉原2丁目8番21-2号")).toEqual({
      region: "静岡県",
      locality: "富士市",
      street: "吉原2丁目8番21-2号",
    });
  });
});

describe("homeStructuredData", () => {
  const data = homeStructuredData();
  const [business, website] = data["@graph"] as Record<string, unknown>[];

  it("店舗情報はサイトに載っている値でつくる", () => {
    expect(business["@type"]).toBe("LocalBusiness");
    expect(business.name).toBe("worx mt.fuji 橘香堂（近藤薬局）");
    expect(business.alternateName).toEqual(
      expect.arrayContaining(["橘香堂（きっこうどう）", "きっこうどう", "worx mt.fuji", "橘香堂近藤薬局"]),
    );
    expect(business.sameAs).toEqual([
      "https://www.instagram.com/kikkou2022/",
      "https://x.com/kikkoudo_0321",
      "https://www.facebook.com/p/%E6%A9%98%E9%A6%99%E5%A0%82%E8%BF%91%E8%97%A4%E8%96%AC%E5%B1%80worx-mtfuji-100095544335452/",
    ]);
    expect(business.telephone).toBe("0545-67-7400");
    expect(business.address).toMatchObject({
      postalCode: "417-0051",
      addressRegion: "静岡県",
      addressLocality: "富士市",
      streetAddress: "吉原2丁目8番21-2号",
    });
    expect(business.geo).toMatchObject({ "@type": "GeoCoordinates" });
    expect(business.priceRange).toBe("¥550〜");
  });

  it("サイト名は店舗情報を発行元として結び付ける", () => {
    expect(website["@type"]).toBe("WebSite");
    expect(website.publisher).toEqual({ "@id": "https://worxmtfuji.com/#business" });
  });

  it("JSON として壊れず、Facebook の URL をそのまま含む", () => {
    const json = JSON.stringify(data);
    expect(() => JSON.parse(json)).not.toThrow();
    expect(json).toContain(
      "https://www.facebook.com/p/%E6%A9%98%E9%A6%99%E5%A0%82%E8%BF%91%E8%97%A4%E8%96%AC%E5%B1%80worx-mtfuji-100095544335452/",
    );
  });
});

describe("faqStructuredData", () => {
  it("ページにある質問と回答だけを載せる", () => {
    const data = faqStructuredData([{ question: "営業日は？", answer: "平日・土日祝 9:00–18:00です。" }]);
    expect(data["@type"]).toBe("FAQPage");
    expect(data.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "営業日は？",
        acceptedAnswer: { "@type": "Answer", text: "平日・土日祝 9:00–18:00です。" },
      },
    ]);
    expect(() => JSON.parse(JSON.stringify(data))).not.toThrow();
  });
});
