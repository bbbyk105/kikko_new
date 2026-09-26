import { ChevronDown } from "lucide-react";
import type { ManagedReservation } from "@/lib/reservation-manage";

/** マイページの「過去・キャンセル済みのご予約」（折りたたみ） */
export default function ReservationHistory({ reservations }: { reservations: ManagedReservation[] }) {
  if (reservations.length === 0) return null;

  return (
    <details className="group bg-white border border-[#E5E4DF]">
      <summary className="flex items-center justify-between gap-4 px-6 py-5 sm:px-10 cursor-pointer text-sm text-[#2C2C2C] list-none">
        過去・キャンセル済みのご予約（{reservations.length}件）
        <ChevronDown
          className="w-4 h-4 text-[#9A9A9A] transition-transform group-open:rotate-180"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </summary>
      <ul className="border-t border-[#E5E4DF] px-6 sm:px-10">
        {reservations.map((r) => (
          <li
            key={r.id}
            className="py-4 border-b last:border-b-0 border-[#E5E4DF] flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm"
          >
            <span className="text-[#2C2C2C]">
              {r.dateLabel} {r.timeLabel}
            </span>
            <span className="text-[#6B6B6B]">
              {r.typeLabel}
              {r.cancelState === "cancelled" && `・${r.statusLabel}`}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
