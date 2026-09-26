import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { reserveData } from "@/app/data/site";
import { PRIVATE_TIME_LABEL, reserveTypeLabel } from "@/lib/reserve-flow";
import { normalizeReservationTime, parseTimeRange } from "@/lib/reservation-time";
import type { Reservation } from "@/lib/supabase";

const JST = "Asia/Tokyo";

export type ReservationStatus = Reservation["status"];

/** Web からキャンセルできるか */
export type CancelState =
  /** 締切（利用日の前日 17:00）前 */
  | "cancellable"
  /** 締切を過ぎた〜利用日当日（電話で受付） */
  | "closed"
  /** 利用日を過ぎた */
  | "past"
  | "cancelled";

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "確認中",
  confirmed: "予約確定",
  cancelled: "キャンセル済み",
};

/** 予約確認ページ・メールに出す予約内容（表示用に整形済み） */
export type ManagedReservation = {
  id: string;
  name: string;
  typeLabel: string;
  dateLabel: string;
  timeLabel: string;
  peopleCount: number | null;
  status: ReservationStatus;
  statusLabel: string;
  cancelState: CancelState;
  /** 例: 10月2日(金) 17:00 */
  cancelDeadlineLabel: string;
};

export type ManageReservationResult =
  | { ok: true; reservation: ManagedReservation }
  | { ok: false; error: string };

type ReservationRow = Pick<
  Reservation,
  "id" | "name" | "type" | "date" | "time" | "people_count" | "status"
>;

/** Web キャンセルの締切（利用日 yyyy-MM-dd の前日の reserveData.cancelDeadlineTime、日本時間） */
export function cancelDeadlineOf(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const previousDay = new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
  return fromZonedTime(`${previousDay}T${reserveData.cancelDeadlineTime}:00`, JST);
}

export function cancelDeadlineLabelOf(date: string): string {
  return formatInTimeZone(cancelDeadlineOf(date), JST, "M月d日(E) HH:mm", { locale: ja });
}

export function cancelStateOf(
  reservation: { date: string; status: ReservationStatus },
  now: Date = new Date(),
): CancelState {
  if (reservation.status === "cancelled") return "cancelled";
  if (reservation.date < formatInTimeZone(now, JST, "yyyy-MM-dd")) return "past";
  return now < cancelDeadlineOf(reservation.date) ? "cancellable" : "closed";
}

/** 利用日の表示（例: 2026年10月3日(土)） */
export function reservationDateLabel(date: string): string {
  return format(parseISO(date), "yyyy年M月d日(E)", { locale: ja });
}

/** 利用時間の表示。貸切は終日、会議室は「10:00〜13:00」 */
export function reservationTimeLabel(type: string, time: string | null): string {
  if (type === "private") return PRIVATE_TIME_LABEL;
  const range = parseTimeRange(time);
  if (range) return `${range.start}〜${range.end}`;
  return normalizeReservationTime(time) ?? "時間指定なし";
}

export function toManagedReservation(
  row: ReservationRow,
  now: Date = new Date(),
): ManagedReservation {
  return {
    id: row.id,
    name: row.name,
    typeLabel: reserveTypeLabel(row.type) || row.type,
    dateLabel: reservationDateLabel(row.date),
    timeLabel: reservationTimeLabel(row.type, row.time),
    peopleCount: row.people_count,
    status: row.status,
    statusLabel: RESERVATION_STATUS_LABEL[row.status] ?? row.status,
    cancelState: cancelStateOf(row, now),
    cancelDeadlineLabel: cancelDeadlineLabelOf(row.date),
  };
}
