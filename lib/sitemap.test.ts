import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);

  it("公開ページを自己参照の URL で出し、管理画面やマイページは含めない", () => {
    expect(urls).toEqual([
      "https://worxmtfuji.com",
      "https://worxmtfuji.com/about",
      "https://worxmtfuji.com/space",
      "https://worxmtfuji.com/space/coworking",
      "https://worxmtfuji.com/space/meeting",
      "https://worxmtfuji.com/space/address",
      "https://worxmtfuji.com/space/event",
      "https://worxmtfuji.com/pricing",
      "https://worxmtfuji.com/access",
      "https://worxmtfuji.com/faq",
      "https://worxmtfuji.com/reserve",
      "https://worxmtfuji.com/contact",
      "https://worxmtfuji.com/privacy",
    ]);
  });

  it("各 URL に内容の更新日を付ける", () => {
    for (const entry of entries) {
      expect(entry.lastModified).toBe("2026-10-22");
    }
  });
});