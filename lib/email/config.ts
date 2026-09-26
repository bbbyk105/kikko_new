import "server-only";
import { siteConfig } from "@/app/data/site";

/** 自動送信メールの差出人（未設定ならメールを送らない） */
export function notificationFrom(): string | undefined {
  return process.env.RESEND_FROM ?? process.env.RESERVATION_EMAIL_FROM;
}

/** 予約の通知先（管理者） */
export function reservationAdminTo(): string {
  return process.env.RESERVATION_EMAIL_TO ?? siteConfig.email;
}

/** お客様向けメールの Reply-To（未設定時はサイトの問い合わせメール） */
export function customerReplyTo(): string {
  return process.env.RESEND_REPLY_TO ?? siteConfig.email;
}

/** お客様への控えメールを送るか */
export function customerCopyEnabled(): boolean {
  return process.env.RESEND_CUSTOMER_COPY !== "false";
}
