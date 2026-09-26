import { createHmac, timingSafeEqual } from "node:crypto";

/** login: メールで送るログイン用リンク / session: ログイン後の Cookie */
export type CustomerTokenPurpose = "login" | "session";

function sign(body: string, purpose: CustomerTokenPurpose, secret: string): string {
  return createHmac("sha256", secret).update(`customer-${purpose}:v1:${body}`).digest("base64url");
}

/**
 * メールアドレスと有効期限を署名したトークン（`本文.署名`）。DB に保存しないので、
 * 秘密鍵（CUSTOMER_AUTH_SECRET）を変えると発行済みのリンク・ログイン状態はすべて無効になる。
 */
export function issueCustomerToken(
  email: string,
  purpose: CustomerTokenPurpose,
  secret: string,
  ttlSeconds: number,
  now: number = Date.now(),
): string {
  const payload = { e: email.trim().toLowerCase(), exp: Math.floor(now / 1000) + ttlSeconds };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, purpose, secret)}`;
}

/** 署名と期限が正しければメールアドレス（小文字）を返す。それ以外は null */
export function readCustomerToken(
  token: string,
  purpose: CustomerTokenPurpose,
  secret: string,
  now: number = Date.now(),
): string | null {
  // メールアドレス（最長 254 文字）を入れても 500 文字ほど。それより長い入力は検証せずに捨てる
  if (!secret || !token || token.length > 1024) return null;
  const [body, signature, ...rest] = token.split(".");
  if (!body || !signature || rest.length > 0) return null;

  const expected = Buffer.from(sign(body, purpose, secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof payload !== "object" || payload === null) return null;
    const { e, exp } = payload as { e?: unknown; exp?: unknown };
    if (typeof e !== "string" || typeof exp !== "number") return null;
    return exp * 1000 > now ? e : null;
  } catch {
    return null;
  }
}
