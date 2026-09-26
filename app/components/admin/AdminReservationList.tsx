import { StickyNote } from "lucide-react";
import { groupByDate, todayJst, type AdminReservation } from "@/lib/admin-reservations";
import { cn } from "@/lib/utils";
import { STATUS_BADGE } from "./ui";

interface AdminReservationListProps {
  reservations: AdminReservation[];
  onSelect: (id: string) => void;
}

/** 利用日ごとの予約一覧。行を押すと詳細を開く */
export default function AdminReservationList({ reservations, onSelect }: AdminReservationListProps) {
  if (reservations.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-[#8A8A8A] bg-white border border-[#E5E4DF]">
        該当する予約はありません。
      </p>
    );
  }

  const today = todayJst();

  return (
    <div className="space-y-6">
      {groupByDate(reservations).map((group) => (
        <section key={group.date} aria-label={group.dateLabel}>
          <h3 className="flex items-center gap-3 mb-2 text-sm text-[#2C2C2C]">
            {group.dateLabel}
            {group.date === today && (
              <span className="px-2 py-0.5 text-[11px] text-[#FAFAF8] bg-[#5C6B5C]">今日</span>
            )}
            <span className="text-xs text-[#8A8A8A]">{group.items.length}件</span>
          </h3>
          <ul className="bg-white border border-[#E5E4DF] divide-y divide-[#E5E4DF]">
            {group.items.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => onSelect(r.id)}
                  className={cn(
                    "w-full grid grid-cols-[5.5rem_1fr_auto] sm:grid-cols-[7.5rem_9rem_1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 text-left text-sm hover:bg-[#FAFAF8] transition-colors",
                    r.status === "cancelled" && "text-[#9A9A9A]",
                  )}
                >
                  <span className="tabular-nums">{r.timeLabel}</span>
                  <span className="hidden sm:block text-[#6B6B6B]">{r.typeLabel}</span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate">
                        {r.name} 様{r.peopleCount ? `（${r.peopleCount}名）` : ""}
                      </span>
                      {r.staffNote && (
                        <StickyNote
                          className="w-3.5 h-3.5 shrink-0 text-[#8A6A2F]"
                          strokeWidth={1.5}
                          aria-label="店内メモあり"
                        />
                      )}
                    </span>
                    <span className="block sm:hidden text-xs text-[#8A8A8A]">{r.typeLabel}</span>
                  </span>
                  <span className={cn("px-2 py-0.5 text-[11px] border whitespace-nowrap", STATUS_BADGE[r.status])}>
                    {r.statusLabel}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
