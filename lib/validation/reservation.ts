import { addDays, format, isValid, parseISO } from "date-fns";
import { z } from "zod";
import { reserveData, siteConfig } from "@/app/data/site";
import {
  BOOKING_WINDOW_DAYS,
  normalizeReservationTime,
  parseTimeRange,
  timeToMinutes,
  todayJst,
} from "@/lib/reservation-time";
import { RESERVE_TYPES, type ReserveType } from "@/lib/routes";

const INVALID_SELECTION = "予約内容が正しくありません。もう一度お選びください。";
const INVALID_TIME = "日時の選び方が正しくありません。もう一度お選びください。";

/** 空欄は null にそろえる任意入力 */
const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .nullable()
    .transform((value) => value || null);

/**
 * Web の予約フォームから届いた値の形。画面の入力チェックと同じ内容に、文字数の上限を加えている。
 * 画面を通さない送信もあるので、サーバーではこれを通してから扱う。
 */
const webReservationSchema = z.object({
  type: z.enum(RESERVE_TYPES, { message: INVALID_SELECTION }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, INVALID_SELECTION),
  time: z.string().trim().nullable(),
  peopleCount: z
    .number()
    .int(INVALID_SELECTION)
    .min(1, "人数は1名以上で入力してください")
    // 施設の定員（スタンディング最大）まで
    .max(siteConfig.capacity.standing, `人数は${siteConfig.capacity.standing}名以下で入力してください`)
    .nullable(),
  name: z
    .string()
    .trim()
    .min(1, "お名前を入力してください")
    .max(100, "お名前は100文字以内で入力してください"),
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .max(254, "メールアドレスが長すぎます")
    .email("正しいメールアドレスを入力してください"),
  phone: optionalText(30, "電話番号は30文字以内で入力してください"),
  message: z
    .string()
    .trim()
    .min(1, "お問い合わせ内容を入力してください")
    .max(2000, "お問い合わせ内容は2000文字以内で入力してください"),
});

export type WebReservation = z.infer<typeof webReservationSchema>;

/** 予約できない日なら、お客様に見せるメッセージ（今日〜BOOKING_WINDOW_DAYS 日先まで、日本時間） */
function bookingDateError(date: string, now: Date): string | null {
  const parsed = parseISO(date);
  if (!isValid(parsed) || format(parsed, "yyyy-MM-dd") !== date) return INVALID_SELECTION;

  const today = todayJst(now);
  if (date < today) return "過ぎた日付は予約できません。別の日をお選びください。";
  const lastDay = format(addDays(parseISO(today), BOOKING_WINDOW_DAYS), "yyyy-MM-dd");
  if (date > lastDay) {
    return `ご予約は${BOOKING_WINDOW_DAYS}日先まで承ります。別の日をお選びください。`;
  }
  return null;
}

/**
 * 種別に合った時間の指定を、保存する形にそろえる。予約カレンダーで選べない指定なら undefined。
 * - 貸切: 終日なので時間は持たない（null）
 * - 会議室: "HH:mm-HH:mm"（開始は時間枠、終了は終了時刻の候補から。終了は開始より後）
 * - それ以外: 1時間枠の開始時刻 "HH:mm"
 */
function slotTimeFor(type: ReserveType, time: string | null): string | null | undefined {
  if (type === "private") return null;

  if (type === "meeting") {
    const range = parseTimeRange(time);
    if (!range) return undefined;
    const startOk = reserveData.timeSlots.includes(range.start);
    const endOk = reserveData.meetingEndHourOptions.includes(range.end);
    if (!startOk || !endOk || timeToMinutes(range.end) <= timeToMinutes(range.start)) return undefined;
    return `${range.start}-${range.end}`;
  }

  const slot = normalizeReservationTime(time);
  return slot && reserveData.timeSlots.includes(slot) ? slot : undefined;
}

/**
 * Web の予約フォームの送信内容を確かめ、前後の空白や時刻の表記をそろえて返す。
 * 当日のすでに過ぎた時間かどうかと、ほかの予約との重なりは、呼び出し側で確かめる。
 */
export function parseWebReservation(
  input: unknown,
  now: Date = new Date(),
): { ok: true; value: WebReservation } | { ok: false; error: string } {
  const parsed = webReservationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? INVALID_SELECTION };
  }
  const value = parsed.data;

  const dateError = bookingDateError(value.date, now);
  if (dateError) return { ok: false, error: dateError };

  const time = slotTimeFor(value.type, value.time);
  if (time === undefined) return { ok: false, error: INVALID_TIME };

  return { ok: true, value: { ...value, time } };
}
