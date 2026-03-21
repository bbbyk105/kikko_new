"use server";

import { reserveData } from "@/app/data/site";
import { occupiedHourSlotsFromReservationTime } from "@/lib/reservation-time";
import { supabase } from "@/lib/supabase";

export type ReservationCalendarAvailability = {
  /** 貸切（終日）が入っている日 */
  privateDates: string[];
  /** 日付ごとの予約済み時刻（HH:mm） */
  bookedTimesByDate: Record<string, string[]>;
};

/**
 * 指定期間の予約状況を取得（キャンセル以外）。
 * - 貸切: type === 'private' で終日ブロック
 * - 時間帯の占有: **会議室（meeting）のみ**。ビジター等は共有利用のため枠を埋めない。
 */
export async function getReservationAvailability(
  startDate: string,
  endDate: string,
): Promise<ReservationCalendarAvailability> {
  try {
    const { data, error } = await supabase
      .from("reservations")
      .select("date, time, type")
      .gte("date", startDate)
      .lte("date", endDate)
      .neq("status", "cancelled");

    if (error) {
      console.error("getReservationAvailability:", error);
      return { privateDates: [], bookedTimesByDate: {} };
    }

    const privateSet = new Set<string>();
    const timesByDate: Record<string, Set<string>> = {};

    for (const row of data ?? []) {
      const d = row.date as string;
      if (row.type === "private") {
        privateSet.add(d);
        continue;
      }
      if (row.type !== "meeting") {
        continue;
      }
      const raw = row.time as string | null;
      const occupied = occupiedHourSlotsFromReservationTime(
        raw,
        reserveData.timeSlots,
      );
      if (occupied.length === 0) continue;
      if (!timesByDate[d]) timesByDate[d] = new Set();
      for (const slot of occupied) {
        timesByDate[d].add(slot);
      }
    }

    const bookedTimesByDate: Record<string, string[]> = {};
    for (const [d, set] of Object.entries(timesByDate)) {
      bookedTimesByDate[d] = [...set].sort();
    }

    return {
      privateDates: [...privateSet].sort(),
      bookedTimesByDate,
    };
  } catch (e) {
    console.error("getReservationAvailability:", e);
    return { privateDates: [], bookedTimesByDate: {} };
  }
}
