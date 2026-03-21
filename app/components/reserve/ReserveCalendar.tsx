"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  parse,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  isAfter,
  startOfDay,
  addDays,
} from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { reserveData } from "@/app/data/site";
import { getReservationAvailability } from "@/app/actions/reservation-availability";
import {
  findFirstAvailableMeetingRange,
  isSlotPastForSelectedDay,
  meetingRangeIsFreeAndNotPast,
  normalizeReservationTime,
  timeToMinutes,
} from "@/lib/reservation-time";

interface ReserveCalendarProps {
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string | undefined) => void;
  isPrivateBooking?: boolean;
  isMeetingBooking?: boolean;
}

function ReserveCalendar({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  isPrivateBooking = false,
  isMeetingBooking = false,
}: ReserveCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [privateDates, setPrivateDates] = React.useState<string[]>([]);
  const [bookedTimesByDate, setBookedTimesByDate] = React.useState<
    Record<string, string[]>
  >({});
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState(false);

  /** Date オブジェクトは毎レンダーで参照が変わるため、月単位の文字列で依存を安定させる */
  const viewMonthKey = format(startOfMonth(currentMonth), "yyyy-MM");

  const { days, monthAnchor } = React.useMemo(() => {
    const anchor = parse(viewMonthKey, "yyyy-MM", new Date());
    const ms = startOfMonth(anchor);
    const me = endOfMonth(ms);
    const cs = startOfWeek(ms, { locale: ja });
    const ce = endOfWeek(me, { locale: ja });
    return {
      monthAnchor: anchor,
      days: eachDayOfInterval({ start: cs, end: ce }),
    };
  }, [viewMonthKey]);

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 60);

  const earliestViewMonth = startOfMonth(today);
  const latestViewMonth = startOfMonth(maxDate);
  const canGoPrevMonth = isAfter(startOfMonth(monthAnchor), earliestViewMonth);
  const canGoNextMonth = isBefore(startOfMonth(monthAnchor), latestViewMonth);

  const privateSet = React.useMemo(
    () => new Set(privateDates),
    [privateDates],
  );

  React.useEffect(() => {
    let cancelled = false;
    const anchor = parse(viewMonthKey, "yyyy-MM", new Date());
    const ms = startOfMonth(anchor);
    const me = endOfMonth(ms);
    const cs = startOfWeek(ms, { locale: ja });
    const ce = endOfWeek(me, { locale: ja });
    const start = format(cs, "yyyy-MM-dd");
    const end = format(ce, "yyyy-MM-dd");

    setLoading(true);
    setFetchError(false);

    getReservationAvailability(start, end)
      .then((data) => {
        if (!cancelled) {
          setPrivateDates(data.privateDates);
          setBookedTimesByDate(data.bookedTimesByDate);
        }
      })
      .catch(() => {
        if (!cancelled) setFetchError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [viewMonthKey]);

  const isDateDisabled = (date: Date) => {
    return isBefore(date, today) || isBefore(maxDate, date);
  };

  /** ビジター等: 貸切日は不可。当日はまだ来ていない枠が1つ以上ある日のみ選択可 */
  const dayHasVisitorAvailability = (dateStr: string): boolean => {
    if (privateSet.has(dateStr)) return false;
    const booked = new Set(
      (bookedTimesByDate[dateStr] ?? []).map((t) => normalizeReservationTime(t)).filter(Boolean) as string[],
    );
    const dayDate = parse(dateStr, "yyyy-MM-dd", new Date());
    const now = new Date();
    return reserveData.timeSlots.some((slot) => {
      const n = normalizeReservationTime(slot);
      if (!n || booked.has(n)) return false;
      if (isSlotPastForSelectedDay(dayDate, n, now)) return false;
      return true;
    });
  };

  /** 貸切: その日に貸切がなく、他の予約が一切ない日のみ */
  const dayHasPrivateAvailability = (dateStr: string): boolean => {
    if (privateSet.has(dateStr)) return false;
    const times = bookedTimesByDate[dateStr];
    return !times || times.length === 0;
  };

  const hasAvailability = (date: Date) => {
    if (isDateDisabled(date)) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    if (isPrivateBooking) return dayHasPrivateAvailability(dateStr);
    return dayHasVisitorAvailability(dateStr);
  };

  const selectedDateKey = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const isSelectedDayPrivate = selectedDateKey
    ? privateSet.has(selectedDateKey)
    : false;

  /** 表示するのは予約可能な時間帯のみ（ビジター等） */
  const availableTimeSlots = React.useMemo(() => {
    if (!selectedDateKey || isPrivateBooking || isMeetingBooking) return [];
    if (privateSet.has(selectedDateKey)) return [];
    const booked = new Set(
      (bookedTimesByDate[selectedDateKey] ?? [])
        .map((t) => normalizeReservationTime(t))
        .filter(Boolean) as string[],
    );
    const now = new Date();
    return reserveData.timeSlots.filter((slot) => {
      const n = normalizeReservationTime(slot);
      if (!n || booked.has(n)) return false;
      if (
        selectedDate &&
        isSlotPastForSelectedDay(selectedDate, n, now)
      ) {
        return false;
      }
      return true;
    });
  }, [
    selectedDateKey,
    selectedDate,
    isPrivateBooking,
    isMeetingBooking,
    privateSet,
    bookedTimesByDate,
  ]);

  const bookedSlotsForSelectedDay = React.useMemo(() => {
    if (!selectedDateKey) return new Set<string>();
    return new Set(
      (bookedTimesByDate[selectedDateKey] ?? [])
        .map((t) => normalizeReservationTime(t))
        .filter(Boolean) as string[],
    );
  }, [selectedDateKey, bookedTimesByDate]);

  const [meetingStart, setMeetingStart] = React.useState("09:00");
  const [meetingEnd, setMeetingEnd] = React.useState("13:00");

  const commitMeetingRange = React.useCallback(
    (start: string, end: string) => {
      setMeetingStart(start);
      setMeetingEnd(end);
      if (timeToMinutes(end) <= timeToMinutes(start)) {
        onSelectTime(undefined);
        return;
      }
      if (
        !selectedDate ||
        !meetingRangeIsFreeAndNotPast(
          selectedDate,
          start,
          end,
          reserveData.timeSlots,
          bookedSlotsForSelectedDay,
        )
      ) {
        onSelectTime(undefined);
        return;
      }
      onSelectTime(`${start}-${end}`);
    },
    [bookedSlotsForSelectedDay, onSelectTime, selectedDate],
  );

  React.useEffect(() => {
    if (!isMeetingBooking || !selectedDateKey || loading || isSelectedDayPrivate) return;

    const m = selectedTime?.trim().match(/^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/);
    if (m) {
      const a = normalizeReservationTime(m[1]);
      const b = normalizeReservationTime(m[2]);
      if (a && b && selectedDate) {
        setMeetingStart(a);
        setMeetingEnd(b);
        if (
          !meetingRangeIsFreeAndNotPast(
            selectedDate,
            a,
            b,
            reserveData.timeSlots,
            bookedSlotsForSelectedDay,
          )
        ) {
          onSelectTime(undefined);
        }
      }
      return;
    }

    if (!selectedDate) return;

    const first = findFirstAvailableMeetingRange(
      selectedDate,
      reserveData.timeSlots,
      reserveData.meetingEndHourOptions,
      bookedSlotsForSelectedDay,
    );
    if (first) {
      setMeetingStart(first.start);
      setMeetingEnd(first.end);
      onSelectTime(`${first.start}-${first.end}`);
    } else {
      setMeetingStart("09:00");
      setMeetingEnd("13:00");
      onSelectTime(undefined);
    }
  }, [
    isMeetingBooking,
    selectedDateKey,
    selectedDate,
    loading,
    isSelectedDayPrivate,
    bookedSlotsForSelectedDay,
    selectedTime,
    onSelectTime,
  ]);

  const availableSlotsKey = availableTimeSlots.join(",");

  const meetingFutureStartSlots = React.useMemo(() => {
    if (!selectedDate || !isMeetingBooking) return reserveData.timeSlots;
    const now = new Date();
    return reserveData.timeSlots.filter(
      (t) => !isSlotPastForSelectedDay(selectedDate, t, now),
    );
  }, [selectedDate, isMeetingBooking]);

  React.useEffect(() => {
    if (!selectedDateKey || isPrivateBooking || isMeetingBooking || !selectedTime) return;
    const allowed =
      availableSlotsKey === "" ? [] : availableSlotsKey.split(",");
    if (!allowed.includes(selectedTime)) {
      onSelectTime(undefined);
    }
  }, [
    selectedDateKey,
    isPrivateBooking,
    isMeetingBooking,
    selectedTime,
    availableSlotsKey,
    onSelectTime,
  ]);

  return (
    <div className={cn(
      "grid gap-8 lg:gap-12",
      isPrivateBooking ? "grid-cols-1 lg:grid-cols-2 max-w-5xl mx-auto" : "grid-cols-1 lg:grid-cols-2"
    )}>
      {/* Calendar */}
      <div className="bg-white border border-[#E5E4DF] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => canGoPrevMonth && setCurrentMonth(subMonths(currentMonth, 1))}
            disabled={!canGoPrevMonth}
            className="p-2 text-[#6B6B6B] hover:text-[#2C2C2C] hover:bg-[#F7F6F3] transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            aria-label="前月"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="font-[var(--font-cormorant)] text-xl text-[#2C2C2C]">
            {format(monthAnchor, "yyyy年 M月", { locale: ja })}
          </h3>
          <button
            type="button"
            onClick={() => canGoNextMonth && setCurrentMonth(addMonths(currentMonth, 1))}
            disabled={!canGoNextMonth}
            className="p-2 text-[#6B6B6B] hover:text-[#2C2C2C] hover:bg-[#F7F6F3] transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            aria-label="翌月"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {loading && (
          <p className="text-xs text-[#8A8A8A] mb-2">空き状況を読み込み中…</p>
        )}
        {fetchError && (
          <p className="text-xs text-[#B85C5C] mb-2">
            空き状況の取得に失敗しました。ページを再読み込みしてください。
          </p>
        )}

        {/* Week days */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={cn(
                "text-center text-xs py-2 font-medium",
                index === 0 && "text-[#B85C5C]",
                index === 6 && "text-[#5C6B8C]",
                index !== 0 && index !== 6 && "text-[#6B6B6B]"
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, monthAnchor);
            const isDisabled = isDateDisabled(day);
            const dayOfWeek = day.getDay();
            const hasSlots = hasAvailability(day);

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => !isDisabled && hasSlots && onSelectDate(day)}
                disabled={isDisabled || !hasSlots}
                className={cn(
                  "relative aspect-square flex flex-col items-center justify-center text-sm transition-all",
                  !isCurrentMonth && "text-[#D0D0D0]",
                  isCurrentMonth && !isDisabled && hasSlots && "text-[#2C2C2C] hover:bg-[#F7F6F3]",
                  isCurrentMonth && dayOfWeek === 0 && !isDisabled && hasSlots && "text-[#B85C5C]",
                  isCurrentMonth && dayOfWeek === 6 && !isDisabled && hasSlots && "text-[#5C6B8C]",
                  (isDisabled || !hasSlots) && "text-[#D0D0D0] cursor-not-allowed",
                  isSelected && "bg-[#2C2C2C] text-white hover:bg-[#3D3D3D]",
                  isToday(day) && !isSelected && "border border-[#5C6B5C]"
                )}
              >
                <span>{format(day, "d")}</span>
                {isCurrentMonth && !isDisabled && (
                  <span
                    className={cn(
                      "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                      hasSlots ? "bg-[#22C55E]" : "bg-[#EF4444]",
                      isSelected && "bg-white"
                    )}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-[#E5E4DF]">
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <span>空きあり</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span>満席・満員</span>
          </div>
        </div>

        {/* Selected date for private booking */}
        {isPrivateBooking && selectedDate && (
          <div className="mt-6 pt-4 border-t border-[#E5E4DF]">
            <p className="text-sm text-[#5C6B5C]">
              ✓ {format(selectedDate, "yyyy年M月d日(E)", { locale: ja })} を選択中
            </p>
            <p className="text-xs text-[#6B6B6B] mt-1">
              終日貸切（9:00〜18:00）
            </p>
          </div>
        )}
      </div>

      {/* 貸切: 時間帯は参考表示としてすべて満員 */}
      {isPrivateBooking && (
        <div className="bg-white border border-[#E5E4DF] p-6">
          <h3 className="font-[var(--font-cormorant)] text-xl text-[#2C2C2C] mb-2">
            時間帯の目安（終日貸切）
          </h3>
          <p className="text-xs text-[#8A8A8A] mb-6">
            貸切利用は終日のため、以下の時間帯はすべて満員扱いとなります。
          </p>
          <div className="space-y-2">
            {reserveData.timeSlots.map((time) => (
              <div
                key={time}
                className="w-full py-3 px-4 text-sm flex items-center justify-between bg-[#FEF2F2] text-[#9CA3AF] cursor-default"
              >
                <span className="font-medium">{time}</span>
                <span className="text-xs font-medium text-[#EF4444]">× 満員</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 会議室: 利用時間帯（開始〜終了） */}
      {isMeetingBooking && !isPrivateBooking && (
        <div className="bg-white border border-[#E5E4DF] p-6">
          <h3 className="font-[var(--font-cormorant)] text-xl text-[#2C2C2C] mb-6">
            {selectedDate
              ? format(selectedDate, "M月d日(E)", { locale: ja }) + "の利用時間"
              : "日付を選択してください"}
          </h3>

          {selectedDate ? (
            loading ? (
              <div className="flex items-center justify-center h-48 text-[#8A8A8A]">
                <p className="text-sm">読み込み中…</p>
              </div>
            ) : isSelectedDayPrivate ? (
              <div className="flex flex-col items-center justify-center min-h-48 text-center px-2">
                <p className="text-sm text-[#6B6B6B]">
                  この日は貸切予約のため<span className="text-[#B85C5C] font-medium">満員</span>です。
                </p>
                <p className="text-xs text-[#9CA3AF] mt-2">
                  別の日付をお選びください。
                </p>
              </div>
            ) : meetingFutureStartSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-48 text-center px-2">
                <p className="text-sm text-[#6B6B6B]">
                  本日の予約可能な時間帯はありません。
                </p>
                <p className="text-xs text-[#9CA3AF] mt-2">
                  明日以降の日付をお選びください。
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="meeting-start" className="block text-sm text-[#6B6B6B] mb-2">
                      開始
                    </label>
                    <select
                      id="meeting-start"
                      value={meetingStart}
                      onChange={(e) => {
                        const v = e.target.value;
                        const ends = reserveData.meetingEndHourOptions.filter(
                          (opt) => timeToMinutes(opt) > timeToMinutes(v),
                        );
                        const nextEnd =
                          ends.includes(meetingEnd) && timeToMinutes(meetingEnd) > timeToMinutes(v)
                            ? meetingEnd
                            : (ends[0] ?? meetingEnd);
                        commitMeetingRange(v, nextEnd);
                      }}
                      className="w-full px-4 py-3 bg-white border border-[#E5E4DF] text-[#2C2C2C] focus:outline-none focus:border-[#5C6B5C]"
                    >
                      {meetingFutureStartSlots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="meeting-end" className="block text-sm text-[#6B6B6B] mb-2">
                      終了
                    </label>
                    <select
                      id="meeting-end"
                      value={meetingEnd}
                      onChange={(e) => {
                        commitMeetingRange(meetingStart, e.target.value);
                      }}
                      className="w-full px-4 py-3 bg-white border border-[#E5E4DF] text-[#2C2C2C] focus:outline-none focus:border-[#5C6B5C]"
                    >
                      {reserveData.meetingEndHourOptions
                        .filter((opt) => timeToMinutes(opt) > timeToMinutes(meetingStart))
                        .map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-[#8A8A8A]">
                  例: 10:00 〜 13:00（終了時刻は含みません）
                </p>
                {selectedDate && selectedTime?.includes("-") && (
                  <div className="pt-4 border-t border-[#E5E4DF]">
                    <p className="text-sm text-[#5C6B5C]">
                      ✓ {format(selectedDate, "yyyy年M月d日(E)", { locale: ja })}{" "}
                      {selectedTime.replace("-", " 〜 ")} を選択中
                    </p>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-64 text-[#8A8A8A]">
              <p className="text-sm">カレンダーから日付をお選びください</p>
            </div>
          )}
        </div>
      )}

      {/* Time Slots - ビジター等 */}
      {!isPrivateBooking && !isMeetingBooking && (
        <div className="bg-white border border-[#E5E4DF] p-6">
          <h3 className="font-[var(--font-cormorant)] text-xl text-[#2C2C2C] mb-6">
            {selectedDate
              ? format(selectedDate, "M月d日(E)", { locale: ja }) + "の空き状況"
              : "日付を選択してください"}
          </h3>

          {selectedDate ? (
            loading ? (
              <div className="flex items-center justify-center h-48 text-[#8A8A8A]">
                <p className="text-sm">読み込み中…</p>
              </div>
            ) : isSelectedDayPrivate ? (
              <div className="flex flex-col items-center justify-center min-h-[12rem] text-center px-2">
                <p className="text-sm text-[#6B6B6B]">
                  この日は貸切予約のため<span className="text-[#B85C5C] font-medium">満員</span>です。
                </p>
                <p className="text-xs text-[#9CA3AF] mt-2">
                  別の日付をお選びください。
                </p>
              </div>
            ) : availableTimeSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[12rem] text-center px-2">
                <p className="text-sm text-[#6B6B6B]">
                  この日は予約可能な時間帯がありません（満席）。
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableTimeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => onSelectTime(time)}
                    className={cn(
                      "w-full py-3 px-4 text-sm text-left transition-all flex items-center justify-between",
                      selectedTime !== time &&
                        "bg-[#F7F6F3] text-[#2C2C2C] hover:bg-[#E5E4DF]",
                      selectedTime === time &&
                        "bg-[#2C2C2C] text-white"
                    )}
                  >
                    <span className="font-medium">{time}</span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        selectedTime !== time && "text-[#22C55E]",
                        selectedTime === time && "text-white/80"
                      )}
                    >
                      ◎ 予約可
                    </span>
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-64 text-[#8A8A8A]">
              <p className="text-sm">カレンダーから日付をお選びください</p>
            </div>
          )}

          {selectedDate && selectedTime && !isSelectedDayPrivate && (
            <div className="mt-6 pt-4 border-t border-[#E5E4DF]">
              <p className="text-sm text-[#5C6B5C]">
                ✓ {format(selectedDate, "yyyy年M月d日(E)", { locale: ja })}{" "}
                {selectedTime} を選択中
              </p>
            </div>
          )}
        </div>
      )}

      {/* Private booking info */}
      {isPrivateBooking && (
        <div className="lg:hidden bg-[#F7F6F3] p-6">
          <h4 className="text-sm font-medium text-[#2C2C2C] mb-3">貸切利用について</h4>
          <ul className="text-xs text-[#6B6B6B] space-y-2">
            <li>• 営業時間：9:00〜18:00（終日貸切）</li>
            <li>• 収容人数：着席最大80名 / スタンディング最大150名</li>
            <li>• 料金は人数・利用内容により異なります</li>
            <li>• 設備・レイアウトの相談も承ります</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default React.memo(ReserveCalendar);
