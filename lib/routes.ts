import { inquiryTypeOptions } from "@/lib/validation/contact";

/** 予約フォームの利用種別（reserveData.types の value と一致させる） */
export const RESERVE_TYPES = [
  "visitor",
  "coworking",
  "kids",
  "meeting",
  "private",
  "event",
] as const;

export type ReserveType = (typeof RESERVE_TYPES)[number];

export type InquiryType = (typeof inquiryTypeOptions)[number]["value"];

/** 予約フォームへのリンク。type を付けると利用種別を選んだ状態で開く */
export function reserveHref(type?: ReserveType): string {
  return type ? `/reserve?type=${type}` : "/reserve";
}

/** ご予約の確認・キャンセルページ（予約受付メールのリンクは ?id=&t= 付きでここを開く） */
export const RESERVE_MANAGE_PATH = "/reserve/manage";

/** マイページ（メールのログイン用リンクで入り、自分の予約を一覧・キャンセルする） */
export const MYPAGE_PATH = "/mypage";
/** ログイン用リンクの行き先（Cookie を付けてマイページへリダイレクトする Route Handler） */
export const MYPAGE_LOGIN_PATH = "/mypage/login";
/** ログアウト（POST） */
export const MYPAGE_LOGOUT_PATH = "/mypage/logout";
/** ログイン用リンクが無効だったときにマイページへ付けるクエリ */
export const MYPAGE_LOGIN_ERROR_PARAM = "login_error";

/** お問い合わせフォームへのリンク。type を付けると種別を選んだ状態で開く */
export function contactHref(type?: InquiryType): string {
  return type ? `/contact?type=${type}` : "/contact";
}

/** クエリ文字列の値（配列のこともある）を1つに絞る */
function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** ?type= の値が予約種別として正しければ返す */
export function parseReserveType(value: string | string[] | undefined): ReserveType | undefined {
  const v = firstParam(value);
  return RESERVE_TYPES.find((t) => t === v);
}

/** ?type= の値が問い合わせ種別として正しければ返す */
export function parseInquiryType(value: string | string[] | undefined): InquiryType | undefined {
  const v = firstParam(value);
  return inquiryTypeOptions.find((o) => o.value === v)?.value;
}

/** ナビのリンクが現在のページ（またはその配下）を指しているか */
export function isActivePath(pathname: string, href: string): boolean {
  const path = href.split(/[?#]/)[0];
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}
