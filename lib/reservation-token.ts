import { createHmac, timingSafeEqual } from "node:crypto";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * 予約IDの署名。予約確認ページのリンクに付け、これを知っている人（＝予約受付メールの受信者）だけが
 * その予約の確認・キャンセルをできるようにする。DB に保存しないので、過去の予約にもリンクを発行できる。
 */
export function signReservationId(id: string, secret: string): string {
  return createHmac("sha256", secret).update(`reservation-manage:v1:${id}`).digest("base64url");
}

/** リンクの id と署名 t が正しい組み合わせか */
export function verifyReservationToken(id: string, token: string, secret: string): boolean {
  if (!secret || !UUID_PATTERN.test(id) || !token) return false;
  const expected = Buffer.from(signReservationId(id, secret));
  const actual = Buffer.from(token);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
