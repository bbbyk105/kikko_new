import type { ReactNode } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { reserveData } from "@/app/data/site";
import type { useMeetingRange } from "@/app/hooks/use-meeting-range";
import { fieldClassName } from "@/app/components/ui/form-field";

// ============================================
// 共通パーツ
// ============================================

function PanelCard({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <div className="bg-white border border-[#E5E4DF] p-6">
      {title && <h3 className="font-[var(--font-cormorant)] text-xl text-[#2C2C2C] mb-6">{title}</h3>}
      {children}
    </div>
  );
}

function panelTitle(date: Date | undefined, suffix: string) {
  return date ? format(date, "M月d日(E)", { locale: ja }) + suffix : "日付を選択してください";
}

/** 枠が出せないときの中央寄せメッセージ */
function PanelMessage({ children, note }: { children: ReactNode; note?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-48 text-center px-2">
      <p className="text-sm text-[#6B6B6B]">{children}</p>
      {note && <p className="text-xs text-[#9CA3AF] mt-2">{note}</p>}
    </div>
  );
}

function PanelLoading() {
  return (
    <div className="flex items-center justify-center h-48 text-[#8A8A8A]">
      <p className="text-sm">読み込み中…</p>
    </div>
  );
}

function PanelNoDate() {
  return (
    <div className="flex items-center justify-center h-64 text-[#8A8A8A]">
      <p className="text-sm">カレンダーから日付をお選びください</p>
    </div>
  );
}

function PrivateDayMessage() {
  return (
    <PanelMessage note="別の日付をお選びください。">
      この日は貸切予約のため<span className="text-[#B85C5C] font-medium">満員</span>です。
    </PanelMessage>
  );
}

/** 「✓ 2026年9月30日(水) 10:00 を選択中」 */
export function SelectionNote({
  date,
  time,
  className,
  children,
}: {
  date: Date;
  time?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("pt-4 border-t border-[#E5E4DF]", className)}>
      <p className="text-sm text-[#5C6B5C]">
        ✓ {format(date, "yyyy年M月d日(E)", { locale: ja })}
        {time ? ` ${time}` : ""} を選択中
      </p>
      {children}
    </div>
  );
}

// ============================================
// 貸切: 時間帯はすべて満員扱い（参考表示）
// ============================================

export function PrivateTimesPanel() {
  return (
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
  );
}

/** 貸切の案内（モバイルのみ） */
export function PrivateBookingInfo() {
  return (
    <div className="lg:hidden bg-[#F7F6F3] p-6">
      <h4 className="text-sm font-medium text-[#2C2C2C] mb-3">貸切利用について</h4>
      <ul className="text-xs text-[#6B6B6B] space-y-2">
        <li>• 営業時間：9:00〜18:00（終日貸切）</li>
        <li>• 収容人数：着席最大80名 / スタンディング最大150名</li>
        <li>• 料金は人数・利用内容により異なります</li>
        <li>• 設備・レイアウトの相談も承ります</li>
      </ul>
    </div>
  );
}

// ============================================
// 会議室: 開始〜終了を選ぶ
// ============================================

interface MeetingRangePanelProps {
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  loading: boolean;
  isSelectedDayPrivate: boolean;
  range: ReturnType<typeof useMeetingRange>;
}

export function MeetingRangePanel({
  selectedDate,
  selectedTime,
  loading,
  isSelectedDayPrivate,
  range,
}: MeetingRangePanelProps) {
  const renderBody = () => {
    if (!selectedDate) return <PanelNoDate />;
    if (loading) return <PanelLoading />;
    if (isSelectedDayPrivate) return <PrivateDayMessage />;
    if (range.startOptions.length === 0) {
      return (
        <PanelMessage note="明日以降の日付をお選びください。">
          本日の予約可能な時間帯はありません。
        </PanelMessage>
      );
    }
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="meeting-start" className="block text-sm text-[#6B6B6B] mb-2">
              開始
            </label>
            <select
              id="meeting-start"
              value={range.start}
              onChange={(e) => range.changeStart(e.target.value)}
              className={fieldClassName()}
            >
              {range.startOptions.map((t) => (
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
              value={range.end}
              onChange={(e) => range.changeEnd(e.target.value)}
              className={fieldClassName()}
            >
              {range.endOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-[#8A8A8A]">例: 10:00 〜 13:00（終了時刻は含みません）</p>
        {selectedTime?.includes("-") && (
          <SelectionNote date={selectedDate} time={selectedTime.replace("-", " 〜 ")} />
        )}
      </div>
    );
  };

  return <PanelCard title={panelTitle(selectedDate, "の利用時間")}>{renderBody()}</PanelCard>;
}

// ============================================
// ビジター等: 1時間枠を選ぶ
// ============================================

interface VisitorSlotsPanelProps {
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onSelectTime: (time: string) => void;
  loading: boolean;
  isSelectedDayPrivate: boolean;
  slots: string[];
}

export function VisitorSlotsPanel({
  selectedDate,
  selectedTime,
  onSelectTime,
  loading,
  isSelectedDayPrivate,
  slots,
}: VisitorSlotsPanelProps) {
  const renderBody = () => {
    if (!selectedDate) return <PanelNoDate />;
    if (loading) return <PanelLoading />;
    if (isSelectedDayPrivate) return <PrivateDayMessage />;
    if (slots.length === 0) {
      return <PanelMessage>この日は予約できる時間帯がありません。別の日をお選びください。</PanelMessage>;
    }
    return (
      <div className="space-y-2">
        {slots.map((time) => {
          const selected = selectedTime === time;
          return (
            <button
              key={time}
              type="button"
              onClick={() => onSelectTime(time)}
              aria-pressed={selected}
              className={cn(
                "w-full py-3 px-4 text-sm text-left transition-all flex items-center justify-between",
                selected ? "bg-[#2C2C2C] text-white" : "bg-[#F7F6F3] text-[#2C2C2C] hover:bg-[#E5E4DF]",
              )}
            >
              <span className="font-medium">{time}</span>
              <span className={cn("text-xs font-medium", selected ? "text-white/80" : "text-[#22C55E]")}>
                ◎ 予約可
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <PanelCard title={panelTitle(selectedDate, "の空き状況")}>
      {renderBody()}
      {selectedDate && selectedTime && !isSelectedDayPrivate && (
        <SelectionNote date={selectedDate} time={selectedTime} className="mt-6" />
      )}
    </PanelCard>
  );
}
