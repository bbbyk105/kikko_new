import { issueCustomerToken, readCustomerToken } from "@/lib/customer-token";

const SECRET = "test-secret";
const NOW = Date.UTC(2026, 8, 26, 3, 0, 0);

describe("customer token", () => {
  it("期限内なら小文字のメールアドレスを返す", () => {
    const token = issueCustomerToken(" Taro@Example.com ", "login", SECRET, 30 * 60, NOW);
    expect(readCustomerToken(token, "login", SECRET, NOW + 29 * 60 * 1000)).toBe("taro@example.com");
  });

  it("期限を過ぎたら null", () => {
    const token = issueCustomerToken("taro@example.com", "login", SECRET, 30 * 60, NOW);
    expect(readCustomerToken(token, "login", SECRET, NOW + 30 * 60 * 1000)).toBeNull();
  });

  it("用途が違うトークンは使えない（ログイン用リンクを Cookie に流用できない）", () => {
    const token = issueCustomerToken("taro@example.com", "login", SECRET, 30 * 60, NOW);
    expect(readCustomerToken(token, "session", SECRET, NOW)).toBeNull();
  });

  it("本文の書き換え・別の秘密鍵・形式違いは null", () => {
    const token = issueCustomerToken("taro@example.com", "session", SECRET, 3600, NOW);
    const [, signature] = token.split(".");
    const forgedBody = Buffer.from(JSON.stringify({ e: "hanako@example.com", exp: NOW / 1000 + 3600 })).toString(
      "base64url",
    );
    expect(readCustomerToken(`${forgedBody}.${signature}`, "session", SECRET, NOW)).toBeNull();
    expect(readCustomerToken(token, "session", "other-secret", NOW)).toBeNull();
    expect(readCustomerToken(`${token}.extra`, "session", SECRET, NOW)).toBeNull();
    expect(readCustomerToken("", "session", SECRET, NOW)).toBeNull();
    expect(readCustomerToken(token, "session", "", NOW)).toBeNull();
  });
});
