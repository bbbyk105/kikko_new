import { reserveData } from "@/app/data/site";
import {
  RESERVE_TYPES,
  contactHref,
  isActivePath,
  parseInquiryType,
  parseReserveType,
  reserveHref,
} from "@/lib/routes";

describe("reserveHref / contactHref", () => {
  it("種別なしはフォームのトップ、ありはクエリ付き", () => {
    expect(reserveHref()).toBe("/reserve");
    expect(reserveHref("meeting")).toBe("/reserve?type=meeting");
    expect(contactHref()).toBe("/contact");
    expect(contactHref("corporate")).toBe("/contact?type=corporate");
  });
});

describe("parseReserveType", () => {
  it("正しい種別だけ通し、不明な値・未指定は undefined", () => {
    expect(parseReserveType("private")).toBe("private");
    expect(parseReserveType(["meeting", "visitor"])).toBe("meeting");
    expect(parseReserveType("xxx")).toBeUndefined();
    expect(parseReserveType(undefined)).toBeUndefined();
  });

  it("予約フォームの選択肢と種別の一覧が一致している", () => {
    expect(reserveData.types.map((t) => t.value)).toEqual([...RESERVE_TYPES]);
  });
});

describe("parseInquiryType", () => {
  it("正しい種別だけ通す", () => {
    expect(parseInquiryType("address")).toBe("address");
    expect(parseInquiryType("reserve")).toBeUndefined();
    expect(parseInquiryType(undefined)).toBeUndefined();
  });
});

describe("isActivePath", () => {
  it("同じページと配下のページで true", () => {
    expect(isActivePath("/space", "/space")).toBe(true);
    expect(isActivePath("/space/meeting", "/space")).toBe(true);
    expect(isActivePath("/spaces", "/space")).toBe(false);
  });

  it("トップは完全一致のみ、クエリやハッシュは無視する", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/faq", "/")).toBe(false);
    expect(isActivePath("/reserve", "/reserve?type=visitor")).toBe(true);
  });
});
