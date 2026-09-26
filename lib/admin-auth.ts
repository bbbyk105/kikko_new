import "server-only";
import { createRemoteJWKSet } from "jose";
import { headers } from "next/headers";
import { normalizeTeamDomain, parseAllowedEmails, verifyAccessToken } from "@/lib/access-jwt";

export type AdminAuthResult =
  | { ok: true; email: string }
  | { ok: false; reason: "not_configured" | "unauthorized" };

// Cloudflare Access の公開鍵。Worker のインスタンスが生きている間は使い回す（jose がキャッシュと鍵の更新を持つ）
let accessKeys: { domain: string; keys: ReturnType<typeof createRemoteJWKSet> } | null = null;

/**
 * 管理画面の認証。/admin は Cloudflare Access（許可したメールアドレスへのワンタイムコード）で守り、
 * さらにアプリ側でも Access の署名を検証する。Access の設定漏れや、別の URL（workers.dev など）から
 * 直接来たリクエストでも、正しい署名と許可されたメールアドレスがなければ予約データを返さない。
 */
export async function authenticateAdmin(): Promise<AdminAuthResult> {
  // next dev では Access を通らないので、ADMIN_DEV_EMAIL を管理者として扱う（本番ビルドでは使われない）
  if (process.env.NODE_ENV === "development" && process.env.ADMIN_DEV_EMAIL) {
    return { ok: true, email: process.env.ADMIN_DEV_EMAIL };
  }

  const teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN;
  const audience = process.env.CF_ACCESS_AUD;
  const allowedEmails = parseAllowedEmails(process.env.ADMIN_EMAILS);
  if (!teamDomain || !audience || allowedEmails.length === 0) {
    return { ok: false, reason: "not_configured" };
  }

  const token = (await headers()).get("cf-access-jwt-assertion");
  if (!token) return { ok: false, reason: "unauthorized" };

  const domain = normalizeTeamDomain(teamDomain);
  if (accessKeys?.domain !== domain) {
    accessKeys = { domain, keys: createRemoteJWKSet(new URL(`${domain}/cdn-cgi/access/certs`)) };
  }
  const email = await verifyAccessToken(
    token,
    { teamDomain: domain, audience, allowedEmails },
    accessKeys.keys,
  );
  return email ? { ok: true, email } : { ok: false, reason: "unauthorized" };
}
