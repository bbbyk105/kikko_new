import "server-only";
import { RESERVE_MANAGE_PATH } from "@/lib/routes";
import { customerAuthSecret } from "@/lib/customer-auth";
import { signReservationId, verifyReservationToken } from "@/lib/reservation-token";
import { siteOrigin } from "@/lib/site-origin";

/** 予約確認ページの URL。秘密鍵が未設定なら null（メールにリンクを載せない） */
export async function reservationManageUrl(id: string): Promise<string | null> {
  const secret = customerAuthSecret();
  if (!secret) return null;
  const params = new URLSearchParams({ id, t: signReservationId(id, secret) });
  return `${await siteOrigin()}${RESERVE_MANAGE_PATH}?${params}`;
}

export function isValidReservationLink(id: string, token: string): boolean {
  const secret = customerAuthSecret();
  return secret ? verifyReservationToken(id, token, secret) : false;
}
