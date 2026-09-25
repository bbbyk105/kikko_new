import { useMemo, useState } from "react";
import { addMonths, isAfter, isBefore, startOfMonth, subMonths } from "date-fns";
import { buildMonthGrid, toMonthKey } from "@/lib/calendar";

/** 月表示カレンダーの表示月と日付グリッド。minDate〜maxDate の月の外へは移動しない */
export function useMonthCalendar({ minDate, maxDate }: { minDate: Date; maxDate: Date }) {
  // Date は毎レンダーで参照が変わるため、月キー（yyyy-MM）で状態を持つ
  const [monthKey, setMonthKey] = useState(() => toMonthKey(new Date()));
  const grid = useMemo(() => buildMonthGrid(monthKey), [monthKey]);

  const canGoPrev = isAfter(grid.monthAnchor, startOfMonth(minDate));
  const canGoNext = isBefore(grid.monthAnchor, startOfMonth(maxDate));

  const goPrev = () => {
    if (canGoPrev) setMonthKey(toMonthKey(subMonths(grid.monthAnchor, 1)));
  };
  const goNext = () => {
    if (canGoNext) setMonthKey(toMonthKey(addMonths(grid.monthAnchor, 1)));
  };

  return { ...grid, canGoPrev, canGoNext, goPrev, goNext };
}
