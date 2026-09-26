import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";

type RateLimiter = { limit(options: { key: string }): Promise<{ success: boolean }> };

/** wrangler.jsonc の ratelimits。next dev では Cloudflare のバインディングがないので空 */
function limiters(): { EMAIL_SEND_LIMITER?: RateLimiter; IP_SEND_LIMITER?: RateLimiter } {
  try {
    return getCloudflareContext().env as unknown as ReturnType<typeof limiters>;
  } catch {
    return {};
  }
}

/**
 * メール送信を伴う操作（ログイン用リンクなど）の回数制限。
 * 第三者が他人のメールアドレス宛に連続で送りつけたり、送信枠を使い切ったりするのを防ぐ。
 */
export async function allowEmailSend(email: string): Promise<boolean> {
  const { EMAIL_SEND_LIMITER, IP_SEND_LIMITER } = limiters();
  if (process.env.NODE_ENV === "production" && (!EMAIL_SEND_LIMITER || !IP_SEND_LIMITER)) {
    // 制限なしで通してしまうので、設定漏れに気づけるようにする（wrangler.jsonc の ratelimits）
    console.error("allowEmailSend: 回数制限のバインディングが見つかりません");
  }
  const ip = (await headers()).get("cf-connecting-ip");
  const results = await Promise.all([
    EMAIL_SEND_LIMITER?.limit({ key: email.trim().toLowerCase() }),
    ip ? IP_SEND_LIMITER?.limit({ key: ip }) : undefined,
  ]);
  return results.every((result) => result?.success !== false);
}
