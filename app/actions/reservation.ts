"use server";

import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/app/data/site";

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

async function sendNotificationEmail(input: ReservationInput, reservationId: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESERVATION_EMAIL_FROM;
  const to = process.env.RESERVATION_EMAIL_TO ?? siteConfig.email;

  if (!apiKey || !from || !to) {
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

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
      }),
    });
  } catch (error) {
    console.error("Failed to send reservation notification email:", error);
  }
}

export async function createReservation(
  input: ReservationInput
): Promise<ReservationResult> {
  try {
    const { data, error } = await supabase
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
      await sendNotificationEmail(input, data.id);
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

