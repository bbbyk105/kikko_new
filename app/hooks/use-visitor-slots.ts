import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { reserveData } from "@/app/data/site";
import { availableSlotsForDay } from "@/lib/reservation-time";

/** ビジター等は共有スペースの利用で、個室の会議室とは別なので、会議室の予約では枠を減らさない */
const NO_BOOKED_SLOTS = new Set<string>();

/**
 * ビジター等（1時間枠を選ぶ予約）の、選択日に予約できる時間枠。
 * 貸切の日は予約できず、当日は開始済みの枠を除く（サーバーの findWebBookingConflicts と同じ基準）。
 * 空き状況の更新で選択中の枠が取れなくなったら選択を解除する。
 */
export function useVisitorSlots({
  enabled,
  selectedDate,
  selectedTime,
  onSelectTime,
  privateDates,
}: {
  enabled: boolean;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onSelectTime: (time: string | undefined) => void;
  privateDates: Set<string>;
}): string[] {
  const slots = useMemo(() => {
    if (!enabled || !selectedDate) return [];
    if (privateDates.has(format(selectedDate, "yyyy-MM-dd"))) return [];
    return availableSlotsForDay(selectedDate, reserveData.timeSlots, NO_BOOKED_SLOTS);
  }, [enabled, selectedDate, privateDates]);

  // 配列の参照ではなく中身で比較するためのキー
  const slotsKey = slots.join(",");

  useEffect(() => {
    if (!enabled || !selectedDate || !selectedTime) return;
    const allowed = slotsKey === "" ? [] : slotsKey.split(",");
    if (!allowed.includes(selectedTime)) onSelectTime(undefined);
  }, [enabled, selectedDate, selectedTime, slotsKey, onSelectTime]);

  return slots;
}
