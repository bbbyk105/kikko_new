import { isHumanVerified } from "@/lib/turnstile-result";

describe("isHumanVerified", () => {
  it("success で action が合えば通す", () => {
    expect(isHumanVerified({ success: true, action: "reserve" }, "reserve")).toBe(true);
  });
  it("別のフォームのトークン（action 違い）は通さない", () => {
    expect(isHumanVerified({ success: true, action: "login" }, "reserve")).toBe(false);
  });
  it("失敗・期限切れ・使い回しは通さない", () => {
    expect(isHumanVerified({ success: false, "error-codes": ["timeout-or-duplicate"] }, "reserve")).toBe(false);
    expect(isHumanVerified({}, "reserve")).toBe(false);
  });
  it("action を返さないテスト用の鍵は success だけで判断する", () => {
    expect(isHumanVerified({ success: true }, "contact")).toBe(true);
  });
});
