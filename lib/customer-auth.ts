import "server-only";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { MYPAGE_LOGIN_PATH } from "@/lib/routes";
import { issueCustomerToken, readCustomerToken } from "@/lib/customer-token";
import { siteOrigin } from "@/lib/site-origin";

const SESSION_COOKIE = "kikko_session";
/**
 * ログイン用リンクの有効期限（メールの文言にもこの値を使う）。
 * DB に保存しない署名方式のため、期限内は同じリンクを何度でも使える。漏れたときの影響を小さくするため短めにする。
 */
export const LOGIN_LINK_TTL_MINUTES = 15;
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;

/** お客様向けの署名（予約確認リンク・ログイン用リンク・ログイン状態）に使う秘密鍵 */
export function customerAuthSecret(): string | undefined {
  return process.env.CUSTOMER_AUTH_SECRET || undefined;
}

/** マイページのログイン用リンク。秘密鍵が未設定なら null */
export async function loginUrlFor(email: string): Promise<string | null> {
  const secret = customerAuthSecret();
  if (!secret) return null;
  const token = issueCustomerToken(email, "login", secret, LOGIN_LINK_TTL_MINUTES * 60);
  return `${await siteOrigin()}${MYPAGE_LOGIN_PATH}?${new URLSearchParams({ token })}`;
}

export function emailFromLoginToken(token: string): string | null {
  const secret = customerAuthSecret();
  return secret ? readCustomerToken(token, "login", secret) : null;
}

/**
 * ログイン状態の Cookie をレスポンスに付ける（ログイン用リンクの Route Handler から呼ぶ）。
 * Server Action で Cookie を変えるとページが再描画されるため、Route Handler でリダイレクトと一緒に返す。
 */
export function setCustomerSession(response: NextResponse, email: string): void {
  const secret = customerAuthSecret();
  if (!secret) throw new Error("CUSTOMER_AUTH_SECRET が未設定です");
  response.cookies.set(SESSION_COOKIE, issueCustomerToken(email, "session", secret, SESSION_TTL_SECONDS), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export function clearCustomerSession(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE);
}

/** ログイン中のお客様のメールアドレス（小文字）。未ログイン・期限切れなら null */
export async function currentCustomerEmail(): Promise<string | null> {
  const secret = customerAuthSecret();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return secret && token ? readCustomerToken(token, "session", secret) : null;
}
