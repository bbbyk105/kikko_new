import { jwtVerify, type JWTVerifyGetKey } from "jose";

export type AccessConfig = {
  /** 例: https://kikko.cloudflareaccess.com */
  teamDomain: string;
  /** Access アプリケーションの AUD タグ */
  audience: string;
  /** 管理画面を使えるメールアドレス（小文字） */
  allowedEmails: string[];
};

/** "kikko.cloudflareaccess.com" や末尾スラッシュ付きも "https://kikko.cloudflareaccess.com" に揃える */
export function normalizeTeamDomain(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** カンマ区切りのメールアドレスを小文字の配列にする */
export function parseAllowedEmails(value: string | undefined): string[] {
  return (value ?? "")
    .split(/[,;\s]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Cloudflare Access が付ける JWT（Cf-Access-Jwt-Assertion）を検証し、許可されたメールアドレスなら返す。
 * 署名・発行元・AUD・有効期限のどれかが違えば null。
 */
export async function verifyAccessToken(
  token: string,
  config: AccessConfig,
  keys: JWTVerifyGetKey,
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, keys, {
      issuer: config.teamDomain,
      audience: config.audience,
      algorithms: ["RS256"],
    });
    const email = typeof payload.email === "string" ? payload.email.toLowerCase() : null;
    return email && config.allowedEmails.includes(email) ? email : null;
  } catch {
    return null;
  }
}
