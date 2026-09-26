import { addDays, format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { z } from "zod";
import {
  RESERVATION_STATUS_LABEL,
  reservationDateLabel,
  reservationTimeLabel,
  type ReservationStatus,
} from "@/lib/reservation-manage";
import { normalizeReservationTime, parseTimeRange } from "@/lib/reservation-time";
import { reserveTypeLabel } from "@/lib/reserve-flow";
import { RESERVE_TYPES } from "@/lib/routes";
import type { Reservation } from "@/lib/supabase";

const JST = "Asia/Tokyo";

export type AdminView = "upcoming" | "pending" | "past" | "cancelled" | "all";

export const ADMIN_VIEWS: readonly { value: AdminView; label: string }[] = [
  { value: "upcoming", label: "今後" },
  { value: "pending", label: "確認待ち" },
  { value: "past", label: "過去" },
  { value: "cancelled", label: "キャンセル" },
  { value: "all", label: "すべて" },
];

/** 管理画面の予約（表示用ラベル付き） */
export type AdminReservation = {
  id: string;
  createdAtLabel: string;
  type: string;
  typeLabel: string;
  date: string;
  dateLabel: string;
  time: string | null;
  timeLabel: string;
  peopleCount: number | null;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: ReservationStatus;
  statusLabel: string;
  /** 店内メモ（お客様には見せない） */
  staffNote: string | null;
};

export function todayJst(now: Date = new Date()): string {
  return formatInTimeZone(now, JST, "yyyy-MM-dd");
}

export function toAdminReservation(row: Reservation): AdminReservation {
  return {
    id: row.id,
    createdAtLabel: formatInTimeZone(new Date(row.created_at), JST, "yyyy/MM/dd HH:mm"),
    type: row.type,
    typeLabel: reserveTypeLabel(row.type) || row.type,
    date: row.date,
    dateLabel: reservationDateLabel(row.date),
    time: row.time,
    timeLabel: reservationTimeLabel(row.type, row.time),
    peopleCount: row.people_count,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    status: row.status,
    statusLabel: RESERVATION_STATUS_LABEL[row.status] ?? row.status,
    staffNote: row.staff_note ?? null,
  };
}

/** 同じ日の中の並び順（終日→時刻順） */
function timeSortKey(r: Pick<AdminReservation, "type" | "time">): string {
  if (r.type === "private" || !r.time) return "00:00";
  return parseTimeRange(r.time)?.start ?? normalizeReservationTime(r.time) ?? "99:99";
}

/** 利用日ごとにまとめる。日付の並びは受け取った順（ビューごとに昇順・降順が違う）、同じ日の中は時刻順 */
export function groupByDate(
  reservations: AdminReservation[],
): { date: string; dateLabel: string; items: AdminReservation[] }[] {
  const groups = new Map<string, AdminReservation[]>();
  for (const r of reservations) {
    const items = groups.get(r.date) ?? [];
    items.push(r);
    groups.set(r.date, items);
  }
  return [...groups.entries()].map(([date, items]) => ({
    date,
    dateLabel: items[0].dateLabel,
    items: [...items].sort((a, b) => timeSortKey(a).localeCompare(timeSortKey(b))),
  }));
}

export type AdminSummary = { today: number; next7Days: number; pending: number };

/** 今日・今後7日間（今日を含む）・確認待ちの件数（キャンセル済みは除く） */
export function summarize(
  reservations: Pick<Reservation, "date" | "status">[],
  now: Date = new Date(),
): AdminSummary {
  const today = todayJst(now);
  const weekEnd = format(addDays(parseISO(today), 6), "yyyy-MM-dd");
  const active = reservations.filter((r) => r.status !== "cancelled" && r.date >= today);
  return {
    today: active.filter((r) => r.date === today).length,
    next7Days: active.filter((r) => r.date <= weekEnd).length,
    pending: active.filter((r) => r.status === "pending").length,
  };
}

/** 検索（お名前・メール・電話・受付番号・店内メモ）と種別で絞り込む */
export function filterReservations(
  reservations: AdminReservation[],
  { query, type }: { query: string; type: string },
): AdminReservation[] {
  const q = query.trim().toLowerCase();
  const digits = q.replace(/\D/g, "");
  return reservations.filter((r) => {
    if (type && r.type !== type) return false;
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.id.startsWith(q) ||
      (r.staffNote ?? "").toLowerCase().includes(q) ||
      (digits.length >= 3 && (r.phone ?? "").replace(/\D/g, "").includes(digits))
    );
  });
}

const optionalText = z
  .string()
  .trim()
  .transform((value) => value || null)
  .nullable();

/** 管理画面での予約の登録・変更（電話で受けた予約など） */
export const adminReservationSchema = z
  .object({
    type: z.enum(RESERVE_TYPES, { message: "利用種別を選んでください" }),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "利用日を選んでください"),
    time: optionalText,
    peopleCount: z.number().int().min(1, "人数は1以上で入力してください").max(500).nullable(),
    name: z.string().trim().min(1, "お名前を入力してください").max(100),
    // 電話予約ではメールアドレスがないこともある（DB は空文字で保存する）
    email: z.union([z.literal(""), z.string().trim().email("メールアドレスの形式が正しくありません")]),
    phone: optionalText,
    message: optionalText,
    status: z.enum(["pending", "confirmed"]),
  })
  .transform((value) => ({ ...value, time: value.type === "private" ? null : value.time }))
  .refine((value) => !value.time || parseTimeRange(value.time) || normalizeReservationTime(value.time), {
    message: "時間の形式が正しくありません",
    path: ["time"],
  })
  .refine((value) => value.type !== "meeting" || parseTimeRange(value.time), {
    message: "会議室は開始と終了の時刻を選んでください",
    path: ["time"],
  });

export type AdminReservationInput = z.input<typeof adminReservationSchema>;
