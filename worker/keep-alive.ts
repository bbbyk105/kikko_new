/* ------------------------------------------------------------------
   Supabase を眠らせない。

   無料プランの Supabase は、7 日間 DB がほとんど使われないとプロジェクトを止める。
   止まるとホスト名が DNS から消え、予約・空き状況・マイページ・管理画面が全部失敗する
   （2026-10-15 に止まっているのを見つけた）。トップやスペースのページは作り置きを返すので、
   サイトが見られていても DB には届かない。DB を読むのは予約のカレンダーを開いたときと、
   予約・マイページ・管理画面の操作だけ。

   Worker の定期実行（`wrangler.jsonc` の triggers）から一日一回、一行だけ読む。
   ------------------------------------------------------------------ */

export type KeepAliveEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

/**
 * reservations を一行だけ読む。鍵が無ければ何もせず null。
 * 読めなければ投げる（定期実行の失敗として Workers のログに残す）。
 */
export async function pingDatabase(
  env: KeepAliveEnv,
  fetchImpl: typeof fetch = fetch,
): Promise<number | null> {
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const endpoint = new URL(
    "rest/v1/reservations?select=id&limit=1",
    url.endsWith("/") ? url : `${url}/`,
  );
  const res = await fetchImpl(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(10_000),
  });
  // 本文は使わないが、読み切って接続を返す
  const body = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${body.slice(0, 120)}`);
  return res.status;
}
