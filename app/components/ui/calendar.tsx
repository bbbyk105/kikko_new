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
} from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function Calendar({
  selected,
  onSelect,
  disabled,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { locale: ja });
  const calendarEnd = endOfWeek(monthEnd, { locale: ja });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const isDateDisabled = (date: Date) => {
    if (isBefore(date, startOfDay(new Date()))) return true;
    if (disabled) return disabled(date);
    return false;
  };

  return (
    <div className={cn("p-4 bg-white border border-[#E5E4DF]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 text-[#6B6B6B] hover:text-[#2C2C2C] transition-colors"
          aria-label="前月"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-[#2C2C2C]">
          {format(currentMonth, "yyyy年 M月", { locale: ja })}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 text-[#6B6B6B] hover:text-[#2C2C2C] transition-colors"
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
              "text-center text-xs py-2",
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
          const isSelected = selected && isSameDay(day, selected);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isDisabled = isDateDisabled(day);
          const dayOfWeek = day.getDay();

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => !isDisabled && onSelect?.(day)}
              disabled={isDisabled}
              className={cn(
                "aspect-square flex items-center justify-center text-sm transition-colors",
                !isCurrentMonth && "text-[#D0D0D0]",
                isCurrentMonth && !isDisabled && "text-[#2C2C2C] hover:bg-[#F0EFE9]",
                isCurrentMonth && dayOfWeek === 0 && !isDisabled && "text-[#B85C5C]",
                isCurrentMonth && dayOfWeek === 6 && !isDisabled && "text-[#5C6B8C]",
                isDisabled && "text-[#D0D0D0] cursor-not-allowed",
                isSelected && "bg-[#2C2C2C] text-white hover:bg-[#3D3D3D]",
                isToday(day) && !isSelected && "border border-[#5C6B5C]"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
