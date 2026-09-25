import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import { reserveData } from "@/app/data/site";
import { availableSlotsForDay } from "@/lib/reservation-time";

/**
 * ビジター等（1時間枠を選ぶ予約）の、選択日に予約できる時間枠。
 * 空き状況の更新で選択中の枠が取れなくなったら選択を解除する。
 */
export function useVisitorSlots({
  enabled,
  selectedDate,
  selectedTime,
  onSelectTime,
  privateDates,
  bookedSlots,
}: {
  enabled: boolean;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onSelectTime: (time: string | undefined) => void;
  privateDates: Set<string>;
  bookedSlots: Set<string>;
}): string[] {
  const slots = useMemo(() => {
    if (!enabled || !selectedDate) return [];
    if (privateDates.has(format(selectedDate, "yyyy-MM-dd"))) return [];
    return availableSlotsForDay(selectedDate, reserveData.timeSlots, bookedSlots);
  }, [enabled, selectedDate, privateDates, bookedSlots]);

  // 配列の参照ではなく中身で比較するためのキー
  const slotsKey = slots.join(",");

  useEffect(() => {
    if (!enabled || !selectedDate || !selectedTime) return;
    const allowed = slotsKey === "" ? [] : slotsKey.split(",");
    if (!allowed.includes(selectedTime)) onSelectTime(undefined);
  }, [enabled, selectedDate, selectedTime, slotsKey, onSelectTime]);

  return slots;
}
