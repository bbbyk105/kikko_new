import { coordinatesFromMapsEmbed, homeStructuredData, splitJapaneseAddress } from "@/lib/structured-data";

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

  it("JSON として壊れない", () => {
    expect(() => JSON.parse(JSON.stringify(data))).not.toThrow();
  });
});
