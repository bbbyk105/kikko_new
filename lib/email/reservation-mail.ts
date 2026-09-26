import { siteConfig } from "@/app/data/site";
import type { ReservationInput } from "@/app/actions/reservation";
import { cancelDeadlineLabelOf, type ManagedReservation } from "@/lib/reservation-manage";
import { reserveTypeLabel } from "@/lib/reserve-flow";

export type MailContent = { subject: string; text: string };

/** お客様向けメールに載せるリンク（秘密鍵が未設定で発行できないときは null） */
export type CustomerLinks = { manageUrl: string; mypageUrl: string } | null;

const RULE = "────────────────────────";

/** お客様向けメールの署名 */
export function signatureLines(): string[] {
  return [
    siteConfig.officialName,
    siteConfig.address.full,
    `TEL ${siteConfig.phone}`,
    siteConfig.email,
  ];
}

/** 「ご予約の確認・キャンセル」の案内（予約受付・確定・変更のメールに載せる） */
export function manageLinkLines(links: NonNullable<CustomerLinks>, cancelDeadlineLabel: string): string[] {
  return [
    "■ ご予約の確認・キャンセル",
    "下記のページから、ご予約内容の確認とキャンセルができます。",
    links.manageUrl,
    `※ Web でのキャンセルは ${cancelDeadlineLabel} まで承ります。それ以降のキャンセルや日時の変更は、お電話（${siteConfig.phone}）でご連絡ください。`,
    `※ ほかのご予約もまとめて見るときは、マイページ（${links.mypageUrl}）にご予約時のメールアドレスでログインしてください。`,
  ];
}

/** 予約受付メール（Web から予約したお客様向け） */
export function reservationReceivedCustomerMail(
  input: ReservationInput,
  reservationId: string,
  links: CustomerLinks,
): MailContent {
  const dateTimeLabel = input.time
    ? `${input.date} ${input.time}`
    : `${input.date}（終日または時間未指定）`;

  return {
    subject: `【予約を受け付けました】${siteConfig.name}`,
    text: [
      `${input.name} 様`,
      "",
      "この度はお予約をお申し込みいただき、ありがとうございます。",
      "以下の内容で承りました。担当者より改めてご連絡いたします。",
      "",
      RULE,
      `受付番号: ${reservationId}`,
      `利用種別: ${reserveTypeLabel(input.type) || input.type}`,
      `利用日時: ${dateTimeLabel}`,
      ...(input.peopleCount ? [`人数: ${input.peopleCount}名`] : []),
      `お名前: ${input.name}`,
      `メール: ${input.email}`,
      `電話番号: ${input.phone?.trim() || "（未入力）"}`,
      "",
      "ご要望・メッセージ:",
      input.message?.trim() || "（未入力）",
      RULE,
      "",
      ...(links ? [...manageLinkLines(links, cancelDeadlineLabelOf(input.date)), ""] : []),
      ...signatureLines(),
    ].join("\n"),
  };
}

function reservationLines(r: ManagedReservation): string[] {
  return [
    `受付番号: ${r.id}`,
    `利用種別: ${r.typeLabel}`,
    `利用日: ${r.dateLabel}`,
    `時間: ${r.timeLabel}`,
    ...(r.peopleCount ? [`人数: ${r.peopleCount}名`] : []),
  ];
}

/** お客様ご自身がキャンセルしたときの控え */
export function cancellationCustomerMail(r: ManagedReservation): MailContent {
  return {
    subject: `【ご予約のキャンセルを承りました】${siteConfig.name}`,
    text: [
      `${r.name} 様`,
      "",
      "以下のご予約のキャンセルを承りました。",
      "またのご利用をお待ちしております。",
      "",
      RULE,
      ...reservationLines(r),
      RULE,
      "",
      "お心当たりのない場合は、お手数ですがこのメールにご返信ください。",
      "",
      ...signatureLines(),
    ].join("\n"),
  };
}

/** お客様が Web からキャンセルしたときの管理者向け通知 */
export function cancellationAdminMail(
  r: ManagedReservation,
  contact: { email: string; phone: string | null },
  cancelledAt: Date,
): MailContent {
  return {
    subject: `【予約キャンセル】${siteConfig.name} ${r.name} 様`,
    text: [
      "お客様が Web から予約をキャンセルしました。",
      "",
      `キャンセル日時: ${cancelledAt.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}`,
      "",
      ...reservationLines(r),
      "",
      `お名前: ${r.name}`,
      `メール: ${contact.email}`,
      `電話番号: ${contact.phone || "（未入力）"}`,
    ].join("\n"),
  };
}

/** マイページのログイン用リンク */
export function loginLinkMail(url: string, ttlMinutes: number): MailContent {
  return {
    subject: `【マイページのログイン用リンク】${siteConfig.name}`,
    text: [
      `${siteConfig.name}のマイページにログインするためのリンクをお送りします。`,
      "下記のリンクを開くと、ご予約の確認・キャンセルができます。",
      "",
      url,
      "",
      `※ このリンクの有効期限は${ttlMinutes}分です。期限が切れた場合は、もう一度ログイン画面からお送りください。`,
      "※ お心当たりのない場合は、このメールを破棄してください。",
      "",
      ...signatureLines(),
    ].join("\n"),
  };
}

/** 管理画面での操作をお客様に知らせるメールの種類 */
export type StoreNoticeKind = "confirmed" | "created" | "changed" | "cancelled";

const STORE_NOTICE: Record<StoreNoticeKind, { subject: string; intro: string[] }> = {
  confirmed: {
    subject: "【ご予約が確定しました】",
    intro: ["以下の内容でご予約が確定しました。", "ご来館をお待ちしております。"],
  },
  created: {
    subject: "【ご予約を承りました】",
    intro: ["お申し込みいただいたご予約を、以下の内容で承りました。", "ご来館をお待ちしております。"],
  },
  changed: {
    subject: "【ご予約内容を変更しました】",
    intro: ["ご依頼をもとに、ご予約内容を以下のとおり変更いたしました。"],
  },
  cancelled: {
    subject: "【ご予約のキャンセルについて】",
    intro: [
      "誠に恐れ入りますが、以下のご予約をキャンセルとさせていただきました。",
      "ご不明な点がございましたら、お電話またはこのメールへのご返信でお問い合わせください。",
    ],
  },
};

/** 店側（管理画面）で確定・登録・変更・キャンセルしたときのお客様向けメール */
export function storeNoticeMail(kind: StoreNoticeKind, r: ManagedReservation, links: CustomerLinks): MailContent {
  const notice = STORE_NOTICE[kind];
  const showLinks = links && kind !== "cancelled" && r.cancelState === "cancellable";
  return {
    subject: `${notice.subject}${siteConfig.name}`,
    text: [
      `${r.name} 様`,
      "",
      ...notice.intro,
      "",
      RULE,
      ...reservationLines(r),
      ...(kind === "cancelled" ? [] : [`ステータス: ${r.statusLabel}`]),
      RULE,
      "",
      ...(showLinks ? [...manageLinkLines(links, r.cancelDeadlineLabel), ""] : []),
      ...signatureLines(),
    ].join("\n"),
  };
}
