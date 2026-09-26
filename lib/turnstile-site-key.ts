/**
 * Cloudflare Turnstile（フォームのボット対策）のサイトキー。公開して問題ない値。
 * Cloudflare ダッシュボードの Turnstile でウィジェット「kikko forms」を作ると発行される。
 * 空にするとウィジェットを出さず、サーバー側の検証もしない（フォームはボット対策なしで動く）。
 * 秘密鍵は Worker シークレット TURNSTILE_SECRET_KEY。
 */
const PRODUCTION_SITE_KEY = "0x4AAAAAAFD8c5M6EsppjAbf";

/** Cloudflare が用意しているテスト用サイトキー（常に通る）。next dev でだけ使う */
const DEV_TEST_SITE_KEY = "1x00000000000000000000AA";

export const TURNSTILE_SITE_KEY =
  process.env.NODE_ENV === "development" ? DEV_TEST_SITE_KEY : PRODUCTION_SITE_KEY;
