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
import { isReservationTimeInPastForDateJst } from "@/lib/reservation-time";
import { getSupabase } from "@/lib/supabase";

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

export async function createReservation(
  input: ReservationInput,
): Promise<ReservationResult> {
  try {
    if (isReservationTimeInPastForDateJst(input.date, input.time)) {
      return {
        success: false,
        error:
          "指定した時間はすでに過ぎているため、当日の予約としては承れません。別の時間をお選びください。",
      };
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
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: "予約の送信に失敗しました。しばらく経ってからお試しください。",
      };
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
