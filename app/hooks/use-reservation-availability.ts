import { useEffect, useMemo, useState } from "react";
import {
  getReservationAvailability,
  type ReservationCalendarAvailability,
} from "@/app/actions/reservation-availability";

const EMPTY: ReservationCalendarAvailability = { privateDates: [], bookedTimesByDate: {} };

type Result = { key: string; data: ReservationCalendarAvailability; error: boolean };

/**
 * 表示範囲（yyyy-MM-dd）の予約状況をサーバーアクションから取得する。
 * - 結果がどの範囲のものかを持っておき、今の範囲と違えば読み込み中とみなす
 *   （effect 内で loading を setState しないため）
 * - 読み込み中は前の範囲の結果を表示したままにする
 * - 範囲が変わる前の結果が遅れて返ってきても反映しない
 */
export function useReservationAvailability(rangeStart: string, rangeEnd: string) {
  const key = `${rangeStart}_${rangeEnd}`;
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let cancelled = false;
    getReservationAvailability(rangeStart, rangeEnd)
      .then((data) => {
        if (!cancelled) setResult({ key, data, error: false });
      })
      .catch(() => {
        if (!cancelled) setResult((prev) => ({ key, data: prev?.data ?? EMPTY, error: true }));
      });
    return () => {
      cancelled = true;
    };
  }, [key, rangeStart, rangeEnd]);

  const loading = result?.key !== key;
  const data = result?.data ?? EMPTY;
  const privateDates = useMemo(() => new Set(data.privateDates), [data.privateDates]);

  return {
    privateDates,
    bookedTimesByDate: data.bookedTimesByDate,
    loading,
    error: !loading && !!result?.error,
  };
}
