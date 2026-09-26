"use server";

import { after } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/app/data/site";
import { currentCustomerEmail, LOGIN_LINK_TTL_MINUTES, loginUrlFor } from "@/lib/customer-auth";
import { customerReplyTo, notificationFrom } from "@/lib/email/config";
import { sendResendEmail } from "@/lib/email/resend";
import { loginLinkMail } from "@/lib/email/reservation-mail";
import { allowEmailSend } from "@/lib/rate-limit";
import { verifyHuman } from "@/lib/turnstile";
import {
  toManagedReservation,
  type ManagedReservation,
  type ManageReservationResult,
} from "@/lib/reservation-manage";
import {
  cancelByCustomer,
  findReservationById,
  findReservationsByEmail,
} from "@/lib/reservation-service";

export type RequestLoginLinkResult = { success: true } | { success: false; error: string };

export type MyReservationsResult =
  | {
      ok: true;
      email: string;
      /** これからのご予約（利用日の近い順） */
      upcoming: ManagedReservation[];
      /** 利用日を過ぎた・キャンセル済みのご予約（新しい順） */
      history: ManagedReservation[];
    }
  | { ok: false; reason: "unauthenticated" | "error" };

export type CustomerProfile = { email: string; name: string | null; phone: string | null };

const emailSchema = z.string().trim().max(254).email();
const idSchema = z.string().uuid();

/**
 * マイページのログイン用リンクをメールで送る。
 * 予約のあるメールアドレスにだけ送り、予約の有無は画面に返さない（他人のメールアドレスで予約の有無を調べられないように）。
 */
export async function requestLoginLink(
  email: string,
  humanToken?: string | null,
): Promise<RequestLoginLinkResult> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { success: false, error: "正しいメールアドレスを入力してください" };
  }
  const address = parsed.data;

  const human = await verifyHuman(humanToken, "login");
  if (!human.ok) return { success: false, error: human.error };

  const from = notificationFrom();
  const url = await loginUrlFor(address);
  if (!from || !url) {
    console.error("requestLoginLink: RESEND_FROM または CUSTOMER_AUTH_SECRET が未設定です");
    return {
      success: false,
      error: `ただいまログイン用リンクを送信できません。お手数ですが、お電話（${siteConfig.phone}）でお問い合わせください。`,
    };
  }

  if (!(await allowEmailSend(address))) {
    return {
      success: false,
      error: "短い時間に続けて送信されました。1分ほどおいてから、もう一度お試しください。",
    };
  }

  try {
    const reservations = await findReservationsByEmail(address, 1);
    if (reservations.length > 0) {
      // 送信はレスポンスを返した後に行う（予約の有無で応答時間が変わり、予約があると分かってしまわないように）
      after(async () => {
        const result = await sendResendEmail({
          from,
          to: address,
          ...loginLinkMail(url, LOGIN_LINK_TTL_MINUTES),
          replyTo: customerReplyTo(),
          tags: [
            { name: "type", value: "customer-login" },
            { name: "recipient", value: "customer" },
          ],
        });
        if (!result.ok) {
          console.error("Failed to send login link:", result.reason, result.message);
        }
      });
    }
    return { success: true };
  } catch (err) {
    console.error("requestLoginLink:", err);
    return { success: false, error: "送信に失敗しました。しばらく経ってからお試しください。" };
  }
}

/** ログイン中のお客様のご予約 */
export async function getMyReservations(): Promise<MyReservationsResult> {
  const email = await currentCustomerEmail();
  if (!email) return { ok: false, reason: "unauthenticated" };

  try {
    const reservations = (await findReservationsByEmail(email)).map((row) =>
      toManagedReservation(row),
    );
    const isUpcoming = (r: ManagedReservation) =>
      r.cancelState === "cancellable" || r.cancelState === "closed";
    return {
      ok: true,
      email,
      upcoming: reservations.filter(isUpcoming).reverse(),
      history: reservations.filter((r) => !isUpcoming(r)),
    };
  } catch (err) {
    console.error("getMyReservations:", err);
    return { ok: false, reason: "error" };
  }
}

/** マイページからのキャンセル（自分のメールアドレスの予約だけ） */
export async function cancelMyReservation(id: string): Promise<ManageReservationResult> {
  const email = await currentCustomerEmail();
  if (!email) {
    return { ok: false, error: "ログインの有効期限が切れました。もう一度ログインしてください。" };
  }
  if (!idSchema.safeParse(id).success) return { ok: false, error: "ご予約が見つかりません。" };

  try {
    const row = await findReservationById(id);
    if (!row || row.email.toLowerCase() !== email) {
      return { ok: false, error: "ご予約が見つかりません。" };
    }
    return await cancelByCustomer(row);
  } catch (err) {
    console.error("cancelMyReservation:", err);
    return {
      ok: false,
      error: "キャンセルの処理に失敗しました。しばらく経ってからお試しいただくか、お電話でご連絡ください。",
    };
  }
}

/** 予約フォームの自動入力用（ログイン中なら、最後のご予約のお名前・電話番号） */
export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  const email = await currentCustomerEmail();
  if (!email) return null;
  try {
    const [latest] = await findReservationsByEmail(email, 1);
    return { email, name: latest?.name ?? null, phone: latest?.phone ?? null };
  } catch (err) {
    console.error("getCustomerProfile:", err);
    return { email, name: null, phone: null };
  }
}
