import "server-only";
import { headers } from "next/headers";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile-site-key";
import { isHumanVerified, type SiteverifyResponse } from "@/lib/turnstile-result";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
/** Cloudflare が用意しているテスト用の秘密鍵（常に通る）。next dev でだけ使う */
const DEV_TEST_SECRET = "1x0000000000000000000000000000000AA";

/** フォームの種類（ウィジェットの action と合わせる） */
export type HumanCheckAction = "reserve" | "contact" | "login";

export type HumanCheckResult = { ok: true } | { ok: false; error: string };

function turnstileSecret(): string | undefined {
  if (process.env.TURNSTILE_SECRET_KEY) return process.env.TURNSTILE_SECRET_KEY;
  return process.env.NODE_ENV === "development" ? DEV_TEST_SECRET : undefined;
}

/**
 * フォーム送信がボットでないかを Cloudflare Turnstile で確かめる。
 * サイトキーか秘密鍵が未設定のあいだは確認しない（設定漏れはログに出す）。
 */
export async function verifyHuman(
  token: string | null | undefined,
  action: HumanCheckAction,
): Promise<HumanCheckResult> {
  const secret = turnstileSecret();
  if (!TURNSTILE_SITE_KEY || !secret) {
    if (TURNSTILE_SITE_KEY) console.error("verifyHuman: TURNSTILE_SECRET_KEY が未設定です");
    return { ok: true };
  }
  if (!token) {
    return {
      ok: false,
      error: "セキュリティ確認が終わっていません。少し待ってから、もう一度お試しください。",
    };
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    const ip = (await headers()).get("cf-connecting-ip");
    if (ip) body.set("remoteip", ip);
    const res = await fetch(SITEVERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as SiteverifyResponse;
    if (isHumanVerified(data, action)) return { ok: true };
    console.warn("verifyHuman: failed", action, data["error-codes"]);
  } catch (err) {
    console.error("verifyHuman:", err);
  }
  return {
    ok: false,
    error: "セキュリティ確認に失敗しました。ページを再読み込みして、もう一度お試しください。",
  };
}
