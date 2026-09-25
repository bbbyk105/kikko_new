import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { reserveData } from "@/app/data/site";
import {
  findFirstAvailableMeetingRange,
  isSlotPastForSelectedDay,
  meetingEndOptionsAfter,
  meetingRangeIsFreeAndNotPast,
  parseTimeRange,
  pickMeetingEnd,
  timeToMinutes,
} from "@/lib/reservation-time";

const DEFAULT_RANGE = { start: "09:00", end: "13:00" };

type Draft = { dateKey: string; start: string; end: string };

/**
 * 会議室の利用時間帯（開始〜終了）。
 * - 表示する開始・終了は「確定済みの選択（selectedTime）→ その日の編集中の値 → 既定値」の順に決める
 * - 日付が選ばれて未選択なら最初に取れる時間帯を選び、選択が埋まっていたら解除する
 * 確定した時間帯は onSelectTime("HH:mm-HH:mm") で親に渡す。
 */
export function useMeetingRange({
  enabled,
  selectedDate,
  selectedTime,
  onSelectTime,
  bookedSlots,
}: {
  /** 会議室予約で、空き状況の読み込みが終わり、貸切日でもないとき true */
  enabled: boolean;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onSelectTime: (time: string | undefined) => void;
  bookedSlots: Set<string>;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  const { start, end } =
    parseTimeRange(selectedTime) ??
    (draft && draft.dateKey === dateKey ? draft : DEFAULT_RANGE);

  const commit = useCallback(
    (nextStart: string, nextEnd: string) => {
      if (dateKey) setDraft({ dateKey, start: nextStart, end: nextEnd });
      const isValid =
        timeToMinutes(nextEnd) > timeToMinutes(nextStart) &&
        !!selectedDate &&
        meetingRangeIsFreeAndNotPast(
          selectedDate,
          nextStart,
          nextEnd,
          reserveData.timeSlots,
          bookedSlots,
        );
      onSelectTime(isValid ? `${nextStart}-${nextEnd}` : undefined);
    },
    [bookedSlots, dateKey, onSelectTime, selectedDate],
  );

  // 空き状況と選択を同期する（状態は親の onSelectTime にだけ反映）
  useEffect(() => {
    if (!enabled || !selectedDate) return;

    const range = parseTimeRange(selectedTime);
    if (range) {
      const stillFree = meetingRangeIsFreeAndNotPast(
        selectedDate,
        range.start,
        range.end,
        reserveData.timeSlots,
        bookedSlots,
      );
      if (!stillFree) onSelectTime(undefined);
      return;
    }

    const first = findFirstAvailableMeetingRange(
      selectedDate,
      reserveData.timeSlots,
      reserveData.meetingEndHourOptions,
      bookedSlots,
    );
    onSelectTime(first ? `${first.start}-${first.end}` : undefined);
  }, [enabled, selectedDate, selectedTime, bookedSlots, onSelectTime]);

  /** 当日は開始済みの時刻を除いた開始候補 */
  const startOptions = useMemo(() => {
    if (!selectedDate) return reserveData.timeSlots;
    const now = new Date();
    return reserveData.timeSlots.filter((t) => !isSlotPastForSelectedDay(selectedDate, t, now));
  }, [selectedDate]);

  const endOptions = useMemo(
    () => meetingEndOptionsAfter(start, reserveData.meetingEndHourOptions),
    [start],
  );

  const changeStart = useCallback(
    (nextStart: string) =>
      commit(nextStart, pickMeetingEnd(nextStart, end, reserveData.meetingEndHourOptions)),
    [commit, end],
  );

  const changeEnd = useCallback((nextEnd: string) => commit(start, nextEnd), [commit, start]);

  return { start, end, startOptions, endOptions, changeStart, changeEnd };
}
