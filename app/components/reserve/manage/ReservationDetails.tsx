import type { ManagedReservation, ReservationStatus } from "@/lib/reservation-manage";
import { cn } from "@/lib/utils";

const STATUS_CLASS: Record<ReservationStatus, string> = {
  pending: "text-[#6B6B6B] border-[#C9C8C3]",
  confirmed: "text-[#5C6B5C] border-[#5C6B5C]",
  cancelled: "text-[#B85C5C] border-[#B85C5C]",
};

/** 予約確認ページの予約内容 */
export default function ReservationDetails({ reservation: r }: { reservation: ManagedReservation }) {
  const rows = [
    { label: "利用種別", value: r.typeLabel },
    { label: "利用日", value: r.dateLabel },
    { label: "時間", value: r.timeLabel },
    ...(r.peopleCount ? [{ label: "人数", value: `${r.peopleCount}名` }] : []),
    { label: "お名前", value: `${r.name} 様` },
    { label: "受付番号", value: r.id },
  ];

  return (
    <div className="bg-white border border-[#E5E4DF] p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="font-[var(--font-cormorant)] text-2xl text-[#2C2C2C]">ご予約内容</h2>
        <span className={cn("px-3 py-1 text-xs tracking-wider border", STATUS_CLASS[r.status])}>
          {r.statusLabel}
        </span>
      </div>

      <dl className="border-t border-[#E5E4DF]">
        {rows.map((row) => (
          <div key={row.label} className="py-4 border-b border-[#E5E4DF] grid grid-cols-3 gap-4">
            <dt className="text-sm text-[#6B6B6B]">{row.label}</dt>
            <dd className="col-span-2 text-sm text-[#2C2C2C] break-all">{row.value}</dd>
          </div>
        ))}
      </dl>

      {r.status === "pending" && (
        <p className="mt-6 text-xs text-[#8A8A8A] leading-relaxed">
          担当者が内容を確認のうえ、あらためてご連絡いたします。
        </p>
      )}
    </div>
  );
}
