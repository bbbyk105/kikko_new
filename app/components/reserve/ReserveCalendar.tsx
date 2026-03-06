"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
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
  startOfDay,
  addDays,
} from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { reserveData } from "@/app/data/site";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface ReserveCalendarProps {
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  isPrivateBooking?: boolean;
}

function generateAvailability(date: Date): TimeSlot[] {
  return reserveData.timeSlots.map((time) => {
    return { time, available: true };
  });
}

export default function ReserveCalendar({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  isPrivateBooking = false,
}: ReserveCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [availability, setAvailability] = React.useState<TimeSlot[]>([]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { locale: ja });
  const calendarEnd = endOfWeek(monthEnd, { locale: ja });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 60);

  React.useEffect(() => {
    if (selectedDate && !isPrivateBooking) {
      setAvailability(generateAvailability(selectedDate));
    }
  }, [selectedDate, isPrivateBooking]);

  const isDateDisabled = (date: Date) => {
    return isBefore(date, today) || isBefore(maxDate, date);
  };

  const hasAvailability = (date: Date) => {
    if (isDateDisabled(date)) return false;
    return true;
  };

  return (
    <div className={cn(
      "grid gap-8 lg:gap-12",
      isPrivateBooking ? "grid-cols-1 max-w-xl mx-auto" : "grid-cols-1 lg:grid-cols-2"
    )}>
      {/* Calendar */}
      <div className="bg-white border border-[#E5E4DF] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 text-[#6B6B6B] hover:text-[#2C2C2C] hover:bg-[#F7F6F3] transition-colors"
            aria-label="前月"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="font-[var(--font-cormorant)] text-xl text-[#2C2C2C]">
            {format(currentMonth, "yyyy年 M月", { locale: ja })}
          </h3>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 text-[#6B6B6B] hover:text-[#2C2C2C] hover:bg-[#F7F6F3] transition-colors"
            aria-label="翌月"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

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
            const isCurrentMonth = isSameMonth(day, currentMonth);
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
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-[#E5E4DF]">
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <span>空きあり</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span>満席</span>
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

      {/* Time Slots - 貸切以外の場合のみ表示 */}
      {!isPrivateBooking && (
        <div className="bg-white border border-[#E5E4DF] p-6">
          <h3 className="font-[var(--font-cormorant)] text-xl text-[#2C2C2C] mb-6">
            {selectedDate
              ? format(selectedDate, "M月d日(E)", { locale: ja }) + "の空き状況"
              : "日付を選択してください"}
          </h3>

          {selectedDate ? (
            <div className="space-y-2">
              {availability.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => slot.available && onSelectTime(slot.time)}
                  disabled={!slot.available}
                  className={cn(
                    "w-full py-3 px-4 text-sm text-left transition-all flex items-center justify-between",
                    slot.available && selectedTime !== slot.time && 
                      "bg-[#F7F6F3] text-[#2C2C2C] hover:bg-[#E5E4DF]",
                    slot.available && selectedTime === slot.time && 
                      "bg-[#2C2C2C] text-white",
                    !slot.available && 
                      "bg-[#FEF2F2] text-[#9CA3AF] cursor-not-allowed"
                  )}
                >
                  <span className="font-medium">{slot.time}</span>
                  <span className={cn(
                    "text-xs font-medium",
                    slot.available && selectedTime !== slot.time && "text-[#22C55E]",
                    slot.available && selectedTime === slot.time && "text-white/80",
                    !slot.available && "text-[#EF4444]"
                  )}>
                    {slot.available ? "◎ 予約可" : "× 満席"}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-[#8A8A8A]">
              <p className="text-sm">カレンダーから日付をお選びください</p>
            </div>
          )}

          {selectedDate && selectedTime && (
            <div className="mt-6 pt-4 border-t border-[#E5E4DF]">
              <p className="text-sm text-[#5C6B5C]">
                ✓ {format(selectedDate, "yyyy年M月d日(E)", { locale: ja })} {selectedTime} を選択中
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
