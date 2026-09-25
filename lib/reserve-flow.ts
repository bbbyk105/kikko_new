import { format } from "date-fns";
import { reserveData } from "@/app/data/site";
import type { ReservationInput } from "@/app/actions/reservation";
import { parseTimeRange, type BookingMode } from "@/lib/reservation-time";

export type ReserveStep = "type" | "calendar" | "form" | "confirm" | "complete";

/** ステップ表示（番号・ラベル）。complete はインジケーターに出さない */
export const RESERVE_STEP_ITEMS: readonly { num: number; step: ReserveStep; label: string }[] = [
  { num: 1, step: "type", label: "利用種別" },
  { num: 2, step: "calendar", label: "日時選択" },
  { num: 3, step: "form", label: "情報入力" },
  { num: 4, step: "confirm", label: "確認" },
];

export const PRIVATE_TIME_LABEL = "終日貸切（9:00〜18:00）";

export function stepNumberOf(step: ReserveStep): number {
  return RESERVE_STEP_ITEMS.find((s) => s.step === step)?.num ?? 1;
}

export function stepOfNumber(num: number): ReserveStep | undefined {
  return RESERVE_STEP_ITEMS.find((s) => s.num === num)?.step;
}

/** 「戻る」の遷移先。先頭（type）や完了画面では null */
export function previousStep(step: ReserveStep): ReserveStep | null {
  switch (step) {
    case "confirm":
      return "form";
    case "form":
      return "calendar";
    case "calendar":
      return "type";
    default:
      return null;
  }
}

export function bookingModeOf(type: string): BookingMode {
  if (type === "private") return "private";
  if (type === "meeting") return "meeting";
  return "visitor";
}

/** 日時選択が完了しているか（貸切は日付のみ、会議室は開始〜終了、それ以外は時刻が必要） */
export function isDateTimeReady({
  date,
  time,
  mode,
}: {
  date: Date | undefined;
  time: string | undefined;
  mode: BookingMode;
}): boolean {
  if (!date) return false;
  if (mode === "private") return true;
  if (mode === "meeting") return parseTimeRange(time) !== null;
  return !!time;
}

/** ステップインジケーターから target 番号へ移動できるか */
export function canNavigateToStep(
  target: number,
  {
    step,
    hasType,
    dateTimeReady,
  }: { step: ReserveStep; hasType: boolean; dateTimeReady: boolean },
): boolean {
  if (target === stepNumberOf(step)) return false;
  switch (target) {
    case 1:
      return target < stepNumberOf(step);
    case 2:
      return hasType;
    case 3:
      return hasType && dateTimeReady;
    case 4:
      // 確認へは入力画面からのみ（入力値の検証を通す必要があるため）
      return step === "form" && hasType && dateTimeReady;
    default:
      return false;
  }
}

export function reserveTypeLabel(value: string): string {
  return reserveData.types.find((t) => t.value === value)?.label ?? "";
}

/** 選択中の日時を表示用の文字列にする（貸切は終日の表記） */
export function formatSelectedTime(mode: BookingMode, time: string | undefined): string {
  return mode === "private" ? PRIVATE_TIME_LABEL : (time ?? "");
}

/** フォームの入力値と選択中の日時から、サーバーへ送る予約データを作る */
export function buildReservationInput(
  data: {
    type: string;
    name: string;
    email: string;
    phone?: string;
    numberOfPeople?: string;
    message?: string;
  },
  selection: { date: Date | undefined; time: string | undefined; mode: BookingMode },
): ReservationInput {
  return {
    type: data.type,
    date: selection.date ? format(selection.date, "yyyy-MM-dd") : "",
    time: selection.mode === "private" ? null : selection.time || null,
    peopleCount: data.numberOfPeople ? parseInt(data.numberOfPeople, 10) || null : null,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    message: data.message || null,
  };
}
