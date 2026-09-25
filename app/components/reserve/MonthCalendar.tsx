import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { WEEKDAY_LABELS } from "@/lib/calendar";
import type { useMonthCalendar } from "@/app/hooks/use-month-calendar";

interface MonthCalendarProps {
  calendar: ReturnType<typeof useMonthCalendar>;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date) => void;
  /** 受付期間外の日 */
  isOutOfRange: (day: Date) => boolean;
  /** 空きがあり選べる日 */
  canSelectDay: (day: Date) => boolean;
  loading: boolean;
  error: boolean;
  /** カレンダー下部に出す補足（貸切の選択中表示など） */
  children?: ReactNode;
}

const navButtonClass =
  "p-2 text-[#6B6B6B] hover:text-[#2C2C2C] hover:bg-[#F7F6F3] transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent";

/** 空き状況つきの月カレンダー（空きあり=緑、満席=赤の点） */
export default function MonthCalendar({
  calendar,
  selectedDate,
  onSelectDate,
  isOutOfRange,
  canSelectDay,
  loading,
  error,
  children,
}: MonthCalendarProps) {
  return (
    <div className="bg-white border border-[#E5E4DF] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={calendar.goPrev}
          disabled={!calendar.canGoPrev}
          className={navButtonClass}
          aria-label="前月"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-[var(--font-cormorant)] text-xl text-[#2C2C2C]">
          {format(calendar.monthAnchor, "yyyy年 M月", { locale: ja })}
        </h3>
        <button
          type="button"
          onClick={calendar.goNext}
          disabled={!calendar.canGoNext}
          className={navButtonClass}
          aria-label="翌月"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {loading && <p className="text-xs text-[#8A8A8A] mb-2">空き状況を読み込み中…</p>}
      {error && (
        <p className="text-xs text-[#B85C5C] mb-2">
          空き状況の取得に失敗しました。ページを再読み込みしてください。
        </p>
      )}

      {/* Week days */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAY_LABELS.map((day, index) => (
          <div
            key={day}
            className={cn(
              "text-center text-xs py-2 font-medium",
              index === 0 && "text-[#B85C5C]",
              index === 6 && "text-[#5C6B8C]",
              index !== 0 && index !== 6 && "text-[#6B6B6B]",
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {calendar.days.map((day) => {
          const isSelected = !!selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, calendar.monthAnchor);
          const outOfRange = isOutOfRange(day);
          const hasSlots = !outOfRange && canSelectDay(day);
          const selectable = isCurrentMonth && hasSlots;
          const dayOfWeek = day.getDay();

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => hasSlots && onSelectDate(day)}
              disabled={!hasSlots}
              className={cn(
                "relative aspect-square flex flex-col items-center justify-center text-sm transition-all",
                !isCurrentMonth && "text-[#D0D0D0]",
                selectable && "text-[#2C2C2C] hover:bg-[#F7F6F3]",
                selectable && dayOfWeek === 0 && "text-[#B85C5C]",
                selectable && dayOfWeek === 6 && "text-[#5C6B8C]",
                !hasSlots && "text-[#D0D0D0] cursor-not-allowed",
                isSelected && "bg-[#2C2C2C] text-white hover:bg-[#3D3D3D]",
                isToday(day) && !isSelected && "border border-[#5C6B5C]",
              )}
            >
              <span>{format(day, "d")}</span>
              {isCurrentMonth && !outOfRange && (
                <span
                  className={cn(
                    "absolute bottom-1 w-1.5 h-1.5 rounded-full",
                    hasSlots ? "bg-[#22C55E]" : "bg-[#EF4444]",
                    isSelected && "bg-white",
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

      {children}
    </div>
  );
}
