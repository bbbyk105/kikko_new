import "server-only";
import { siteConfig } from "@/app/data/site";
import {
  customerCopyEnabled,
  customerReplyTo,
  notificationFrom,
  reservationAdminTo,
} from "@/lib/email/config";
import { sendResendEmail } from "@/lib/email/resend";
import {
  cancellationAdminMail,
  cancellationCustomerMail,
  type CustomerLinks,
} from "@/lib/email/reservation-mail";
import { reservationManageUrl } from "@/lib/reservation-link";
import {
  toManagedReservation,
  type ManagedReservation,
  type ManageReservationResult,
} from "@/lib/reservation-manage";
import { MYPAGE_PATH } from "@/lib/routes";
import { siteOrigin } from "@/lib/site-origin";
import { getSupabase, type Reservation } from "@/lib/supabase";

/** お客様向けの画面・メールで使う列（message や created_at は含めない） */
export type CustomerReservationRow = Pick<
  Reservation,
  "id" | "name" | "email" | "phone" | "type" | "date" | "time" | "people_count" | "status"
>;

export const CUSTOMER_RESERVATION_COLUMNS =
  "id, name, email, phone, type, date, time, people_count, status";

/** ilike のパターンとして、入力値をそのままの文字列で比べる（_ や % をワイルドカードにしない） */
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

/** メールアドレスが同じ（大文字・小文字の違いは無視）予約。利用日の新しい順 */
export async function findReservationsByEmail(
  email: string,
  limit = 100,
): Promise<CustomerReservationRow[]> {
  const address = email.trim().toLowerCase();
  const { data, error } = await getSupabase()
    .from("reservations")
    .select(CUSTOMER_RESERVATION_COLUMNS)
    .ilike("email", escapeLikePattern(address))
    .order("date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  // ilike は大文字・小文字を無視するための指定。念のため完全一致（大文字・小文字以外）に絞る
  return ((data ?? []) as CustomerReservationRow[]).filter(
    (row) => row.email.toLowerCase() === address,
  );
}

export async function findReservationById(id: string): Promise<CustomerReservationRow | null> {
  const { data, error } = await getSupabase()
    .from("reservations")
    .select(CUSTOMER_RESERVATION_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as CustomerReservationRow | null;
}

/** 予約確認ページとマイページの URL。秘密鍵が未設定なら null */
export async function customerLinksFor(id: string): Promise<CustomerLinks> {
  const manageUrl = await reservationManageUrl(id);
  return manageUrl ? { manageUrl, mypageUrl: `${await siteOrigin()}${MYPAGE_PATH}` } : null;
}

async function sendCustomerCancellationEmails(
  row: CustomerReservationRow,
  reservation: ManagedReservation,
) {
  const from = notificationFrom();
  if (!from) return;

  const admin = await sendResendEmail({
    from,
    to: reservationAdminTo(),
    ...cancellationAdminMail(reservation, row, new Date()),
    tags: [
      { name: "type", value: "reservation-cancel" },
      { name: "recipient", value: "admin" },
    ],
  });
  if (!admin.ok && admin.reason === "api_error") {
    console.error("Failed to send cancellation notification email:", admin.message);
  }

  if (!customerCopyEnabled() || !row.email) return;
  const customer = await sendResendEmail({
    from,
    to: row.email,
    ...cancellationCustomerMail(reservation),
    replyTo: customerReplyTo(),
    tags: [
      { name: "type", value: "reservation-cancel" },
      { name: "recipient", value: "customer" },
    ],
  });
  if (!customer.ok && customer.reason === "api_error") {
    console.error("Failed to send cancellation email to customer:", customer.message);
  }
}

/**
 * お客様ご自身によるキャンセル（予約確認リンク・マイページ共通）。
 * 利用日の前日 17:00 を過ぎていれば受け付けない。
 */
export async function cancelByCustomer(row: CustomerReservationRow): Promise<ManageReservationResult> {
  const current = toManagedReservation(row);
  if (current.cancelState === "cancelled") return { ok: true, reservation: current };
  if (current.cancelState !== "cancellable") {
    return {
      ok: false,
      error: `Web でのキャンセル受付は終了しました。お電話（${siteConfig.phone}）でご連絡ください。`,
    };
  }

  // 二重送信や同時操作で通知メールが重複しないよう、まだキャンセルされていない行だけを更新する
  const { data: updated, error } = await getSupabase()
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("id", row.id)
    .neq("status", "cancelled")
    .select("id");
  if (error) throw error;

  const cancelled = toManagedReservation({ ...row, status: "cancelled" });
  // メール送信は失敗してもキャンセル自体は成功とみなす
  if ((updated ?? []).length > 0) {
    await sendCustomerCancellationEmails(row, cancelled);
  }
  return { ok: true, reservation: cancelled };
}
