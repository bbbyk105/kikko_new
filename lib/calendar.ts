import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ja } from "date-fns/locale";

export const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"] as const;

/** 日付から月キー（yyyy-MM）を作る */
export function toMonthKey(date: Date): string {
  return format(startOfMonth(date), "yyyy-MM");
}

/**
 * 月キー（yyyy-MM）から、前後の週を含むカレンダーの日付一覧と表示範囲を作る。
 * rangeStart / rangeEnd は空き状況の取得範囲にそのまま使う（yyyy-MM-dd）。
 */
export function buildMonthGrid(monthKey: string) {
  const monthAnchor = parse(monthKey, "yyyy-MM", new Date());
  const gridStart = startOfWeek(monthAnchor, { locale: ja });
  const gridEnd = endOfWeek(endOfMonth(monthAnchor), { locale: ja });
  return {
    monthAnchor,
    days: eachDayOfInterval({ start: gridStart, end: gridEnd }),
    rangeStart: format(gridStart, "yyyy-MM-dd"),
    rangeEnd: format(gridEnd, "yyyy-MM-dd"),
  };
}
