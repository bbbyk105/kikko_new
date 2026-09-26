"use server";

import { isValidReservationLink } from "@/lib/reservation-link";
import { toManagedReservation, type ManageReservationResult } from "@/lib/reservation-manage";
import {
  cancelByCustomer,
  findReservationById,
  type CustomerReservationRow,
} from "@/lib/reservation-service";

const INVALID_LINK_ERROR =
  "リンクが正しくありません。予約受付メールのリンクをもう一度お開きいただくか、マイページにログインしてご確認ください。";
const LOAD_ERROR = "ご予約の読み込みに失敗しました。しばらく経ってからお試しください。";
const CANCEL_ERROR =
  "キャンセルの処理に失敗しました。しばらく経ってからお試しいただくか、お電話でご連絡ください。";

/** リンクの id・署名が正しければ予約を返す。正しくない・見つからなければ null */
async function findByLink(id: string, token: string): Promise<CustomerReservationRow | null> {
  if (!isValidReservationLink(id, token)) return null;
  return findReservationById(id);
}

/** 予約受付メールのリンク（?id=&t=）から予約内容を読む */
export async function getManagedReservation(
  id: string,
  token: string,
): Promise<ManageReservationResult> {
  try {
    const row = await findByLink(id, token);
    if (!row) return { ok: false, error: INVALID_LINK_ERROR };
    return { ok: true, reservation: toManagedReservation(row) };
  } catch (err) {
    console.error("getManagedReservation:", err);
    return { ok: false, error: LOAD_ERROR };
  }
}

/** 予約受付メールのリンクからのキャンセル（利用日の前日 17:00 まで） */
export async function cancelManagedReservation(
  id: string,
  token: string,
): Promise<ManageReservationResult> {
  try {
    const row = await findByLink(id, token);
    if (!row) return { ok: false, error: INVALID_LINK_ERROR };
    return await cancelByCustomer(row);
  } catch (err) {
    console.error("cancelManagedReservation:", err);
    return { ok: false, error: CANCEL_ERROR };
  }
}
