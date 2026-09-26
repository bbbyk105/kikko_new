"use server";

import { siteConfig } from "@/app/data/site";
import {
  customerCopyEnabled,
  customerReplyTo,
  notificationFrom,
  reservationAdminTo,
} from "@/lib/email/config";
import { sendResendEmail } from "@/lib/email/resend";
import { reservationReceivedCustomerMail } from "@/lib/email/reservation-mail";
import { customerLinksFor } from "@/lib/reservation-service";
import {
  earlierWebBookingConflicts,
  findWebBookingConflicts,
  type ConflictCandidate,
} from "@/lib/reservation-conflicts";
import { isReservationTimeInPastForDateJst } from "@/lib/reservation-time";
import { RESERVE_TYPES } from "@/lib/routes";
import { getSupabase } from "@/lib/supabase";
import { verifyHuman } from "@/lib/turnstile";

export type ReservationInput = {
  type: string;
  date: string; // YYYY-MM-DD
  time: string | null;
  peopleCount: number | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
};

export type ReservationResult = {
  success: boolean;
  error?: string;
  reservationId?: string;
};

async function sendAdminReservationEmail(
  input: ReservationInput,
  reservationId: string,
) {
  const from = notificationFrom();
  const to = reservationAdminTo();

  if (!from) {
    return;
  }

  const dateTimeLabel = input.time
    ? `${input.date} ${input.time}`
    : `${input.date}（終日または時間未指定）`;

  const subject = `【予約受付】${siteConfig.name} ${input.name} 様`;

  const lines = [
    "以下の内容で予約がありました。",
    "",
    `ID: ${reservationId}`,
    `受付日時: ${new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
    "",
    `利用種別: ${input.type}`,
    `利用日時: ${dateTimeLabel}`,
    input.peopleCount ? `人数: ${input.peopleCount}名` : "",
    "",
    `お名前: ${input.name}`,
    `メール: ${input.email}`,
    `電話番号: ${input.phone || "（未入力）"}`,
    "",
    "お問い合わせ内容:",
    input.message || "（未入力）",
  ];

  const text = lines.filter(Boolean).join("\n");

  const result = await sendResendEmail({
    from,
    to,
    subject,
    text,
    tags: [
      { name: "type", value: "reservation" },
      { name: "recipient", value: "admin" },
    ],
  });

  if (!result.ok && result.reason === "api_error") {
    console.error(
      "Failed to send reservation notification email:",
      result.message,
    );
  }
}

async function sendCustomerReservationConfirmation(
  input: ReservationInput,
  reservationId: string,
) {
  if (!customerCopyEnabled()) {
    return;
  }

  const from = notificationFrom();
  if (!from) {
    return;
  }

  const { subject, text } = reservationReceivedCustomerMail(
    input,
    reservationId,
    await customerLinksFor(reservationId),
  );

  const result = await sendResendEmail({
    from,
    to: input.email,
    subject,
    text,
    replyTo: customerReplyTo(),
    tags: [
      { name: "type", value: "reservation" },
      { name: "recipient", value: "customer" },
    ],
  });

  if (!result.ok && result.reason === "api_error") {
    console.error(
      "Failed to send reservation confirmation to customer:",
      result.message,
    );
  }
}

const SLOT_TAKEN_ERROR =
  "選択した日時は、ほかのご予約で埋まってしまいました。お手数ですが、別の日時をお選びください。";

type SameDayReservation = ConflictCandidate & { created_at: string };

/** 同じ日のキャンセル以外の予約（重なりの確認用。個人情報は名前以外取らない） */
async function sameDayReservations(date: string): Promise<SameDayReservation[]> {
  const { data, error } = await getSupabase()
    .from("reservations")
    .select("id, type, date, time, name, created_at")
    .eq("date", date)
    .neq("status", "cancelled");
  if (error) throw error;
  return (data ?? []) as SameDayReservation[];
}

export async function createReservation(
  input: ReservationInput,
  humanToken?: string | null,
): Promise<ReservationResult> {
  try {
    if (!RESERVE_TYPES.some((type) => type === input.type) || !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      return { success: false, error: "予約内容が正しくありません。もう一度お選びください。" };
    }

    const human = await verifyHuman(humanToken, "reserve");
    if (!human.ok) return { success: false, error: human.error };

    if (isReservationTimeInPastForDateJst(input.date, input.time)) {
      return {
        success: false,
        error:
          "指定した時間はすでに過ぎているため、当日の予約としては承れません。別の時間をお選びください。",
      };
    }

    // カレンダーを開いてから送信するまでの間に埋まっていないか（画面の空き枠だけに頼らない）
    if (findWebBookingConflicts(input, await sameDayReservations(input.date)).length > 0) {
      return { success: false, error: SLOT_TAKEN_ERROR };
    }

    const { data, error } = await getSupabase()
      .from("reservations")
      .insert({
        type: input.type,
        date: input.date,
        time: input.time,
        people_count: input.peopleCount,
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        message: input.message || null,
        status: "pending",
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: "予約の送信に失敗しました。しばらく経ってからお試しください。",
      };
    }

    // ほぼ同時に同じ枠の予約が入った場合は、先に入った方を残し、後から入った自分を取り消す
    const mine = { ...input, id: data.id as string, created_at: data.created_at as string };
    if (earlierWebBookingConflicts(mine, await sameDayReservations(input.date)).length > 0) {
      const removed = await getSupabase().from("reservations").delete().eq("id", mine.id);
      if (removed.error) console.error("Failed to remove conflicting reservation:", removed.error);
      return { success: false, error: SLOT_TAKEN_ERROR };
    }

    // メール送信は失敗しても予約自体は成功とみなす
    if (data?.id) {
      await sendAdminReservationEmail(input, data.id);
      await sendCustomerReservationConfirmation(input, data.id);
    }

    return {
      success: true,
      reservationId: data.id,
    };
  } catch (err) {
    console.error("Reservation error:", err);
    return {
      success: false,
      error: "予約の送信に失敗しました。しばらく経ってからお試しください。",
    };
  }
}
