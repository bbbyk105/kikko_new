"use server";

import { z } from "zod";
import { siteConfig } from "@/app/data/site";
import { sendResendEmail } from "@/lib/email/resend";

const inquiryTypeLabels: Record<string, string> = {
  general: "一般的なご質問",
  membership: "会員登録について",
  corporate: "法人契約について",
  event: "イベント利用について",
  other: "その他",
};

const contactSchema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  phone: z.string().optional(),
  inquiryType: z.enum(
    ["general", "membership", "corporate", "event", "other"],
    { message: "お問い合わせ種別を選択してください" },
  ),
  message: z.string().trim().min(1, "お問い合わせ内容を入力してください"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { success: true }
  | { success: false; error: string };

function notifyFrom(): string | undefined {
  return process.env.RESEND_FROM ?? process.env.RESERVATION_EMAIL_FROM;
}

function notifyTo(): string {
  return (
    process.env.CONTACT_EMAIL_TO ??
    process.env.RESERVATION_EMAIL_TO ??
    siteConfig.email
  );
}

function customerReplyTo(): string {
  return process.env.RESEND_REPLY_TO ?? siteConfig.email;
}

function customerCopyEnabled(): boolean {
  return process.env.RESEND_CUSTOMER_COPY !== "false";
}

async function sendCustomerContactConfirmation(data: {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
}) {
  if (!customerCopyEnabled()) {
    return;
  }

  const from = notifyFrom();
  if (!from) {
    return;
  }

  const typeLabel = inquiryTypeLabels[data.inquiryType] ?? data.inquiryType;
  const subject = `【お問い合わせを受け付けました】${siteConfig.name}`;

  const lines = [
    `${data.name} 様`,
    "",
    "お問い合わせありがとうございます。以下の内容で承りました。",
    "担当者より順次ご連絡いたします。",
    "",
    "────────────────────────",
    `種別: ${typeLabel}`,
    `お名前: ${data.name}`,
    `メール: ${data.email}`,
    `電話番号: ${data.phone?.trim() || "（未入力）"}`,
    "",
    "お問い合わせ内容:",
    data.message,
    "────────────────────────",
    "",
    siteConfig.name,
    siteConfig.address.full,
    `TEL ${siteConfig.phone}`,
    siteConfig.email,
  ];

  const result = await sendResendEmail({
    from,
    to: data.email,
    subject,
    text: lines.join("\n"),
    replyTo: customerReplyTo(),
    tags: [
      { name: "type", value: "contact" },
      { name: "recipient", value: "customer" },
      { name: "inquiry", value: data.inquiryType },
    ],
  });

  if (!result.ok && result.reason === "api_error") {
    console.error(
      "Failed to send contact confirmation to customer:",
      result.message,
    );
  }
}

export async function submitContactInquiry(
  input: ContactInput,
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      success: false,
      error: first?.message ?? "入力内容を確認してください。",
    };
  }

  const data = parsed.data;
  const from = notifyFrom();
  if (!from) {
    return {
      success: false,
      error: "メール送信が設定されていません。管理者にお問い合わせください。",
    };
  }

  const typeLabel = inquiryTypeLabels[data.inquiryType] ?? data.inquiryType;
  const receivedAt = new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });

  const lines = [
    "Webサイトのお問い合わせフォームから送信がありました。",
    "",
    `受付日時: ${receivedAt}`,
    "",
    `お名前: ${data.name}`,
    `メール: ${data.email}`,
    `電話番号: ${data.phone?.trim() || "（未入力）"}`,
    `種別: ${typeLabel}`,
    "",
    "お問い合わせ内容:",
    data.message,
  ];

  const result = await sendResendEmail({
    from,
    to: notifyTo(),
    subject: `【お問い合わせ】${siteConfig.name} ${data.name} 様`,
    text: lines.join("\n"),
    replyTo: data.email,
    tags: [
      { name: "type", value: "contact" },
      { name: "recipient", value: "admin" },
      { name: "inquiry", value: data.inquiryType },
    ],
  });

  if (!result.ok) {
    if (result.reason === "missing_api_key") {
      return {
        success: false,
        error: "メール送信が設定されていません。管理者にお問い合わせください。",
      };
    }
    return {
      success: false,
      error: "送信に失敗しました。しばらく経ってからお試しください。",
    };
  }

  await sendCustomerContactConfirmation(data);

  return { success: true };
}
