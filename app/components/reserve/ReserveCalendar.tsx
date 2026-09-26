"use client";

import { memo, useMemo } from "react";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { reserveData } from "@/app/data/site";
import {
  BOOKING_WINDOW_DAYS,
  isDayBookable,
  toSlotSet,
  type BookingMode,
} from "@/lib/reservation-time";
import { PRIVATE_TIME_LABEL } from "@/lib/reserve-flow";
import { useMonthCalendar } from "@/app/hooks/use-month-calendar";
import { useReservationAvailability } from "@/app/hooks/use-reservation-availability";
import { useMeetingRange } from "@/app/hooks/use-meeting-range";
import { useVisitorSlots } from "@/app/hooks/use-visitor-slots";
import MonthCalendar from "./MonthCalendar";
import {
  MeetingRangePanel,
  PrivateBookingInfo,
  PrivateTimesPanel,
  SelectionNote,
  VisitorSlotsPanel,
} from "./SlotPanels";

interface ReserveCalendarProps {
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string | undefined) => void;
  mode: BookingMode;
}

/**
 * 予約の日時選択（月カレンダー + 右側の時間帯パネル）。
 * 空き状況の取得・会議室の時間帯・ビジター枠の計算は hooks に任せ、ここでは組み立てだけ行う。
 */
function ReserveCalendar({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  mode,
}: ReserveCalendarProps) {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, BOOKING_WINDOW_DAYS);

  const calendar = useMonthCalendar({ minDate: today, maxDate });
  const { privateDates, bookedTimesByDate, loading, error } = useReservationAvailability(
    calendar.rangeStart,
    calendar.rangeEnd,
  );

  const selectedKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const isSelectedDayPrivate = selectedKey ? privateDates.has(selectedKey) : false;
  const bookedSlots = useMemo(
    () => toSlotSet(selectedKey ? bookedTimesByDate[selectedKey] : undefined),
    [selectedKey, bookedTimesByDate],
  );

  const visitorSlots = useVisitorSlots({
    enabled: mode === "visitor",
    selectedDate,
    selectedTime,
    onSelectTime,
    privateDates,
  });

  const meetingRange = useMeetingRange({
    enabled: mode === "meeting" && !loading && !isSelectedDayPrivate,
    selectedDate,
    selectedTime,
    onSelectTime,
    bookedSlots,
  });

  const isOutOfRange = (day: Date) => isBefore(day, today) || isBefore(maxDate, day);
  const canSelectDay = (day: Date) =>
    isDayBookable(day, { mode, privateDates, bookedTimesByDate, timeSlots: reserveData.timeSlots });

  return (
    <div
      className={cn(
        "grid gap-8 lg:gap-12 grid-cols-1 lg:grid-cols-2",
        mode === "private" && "max-w-5xl mx-auto",
      )}
    >
      <MonthCalendar
        calendar={calendar}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        isOutOfRange={isOutOfRange}
        canSelectDay={canSelectDay}
        loading={loading}
        error={error}
      >
        {mode === "private" && selectedDate && (
          <SelectionNote date={selectedDate} className="mt-6">
            <p className="text-xs text-[#6B6B6B] mt-1">{PRIVATE_TIME_LABEL}</p>
          </SelectionNote>
        )}
      </MonthCalendar>

      {mode === "private" && (
        <>
          <PrivateTimesPanel />
          <PrivateBookingInfo />
        </>
      )}

      {mode === "meeting" && (
        <MeetingRangePanel
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          loading={loading}
          isSelectedDayPrivate={isSelectedDayPrivate}
          range={meetingRange}
        />
      )}

      {mode === "visitor" && (
        <VisitorSlotsPanel
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSelectTime={onSelectTime}
          loading={loading}
          isSelectedDayPrivate={isSelectedDayPrivate}
          slots={visitorSlots}
        />
      )}
    </div>
  );
}

export default memo(ReserveCalendar);
