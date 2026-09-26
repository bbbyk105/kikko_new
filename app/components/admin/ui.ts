import type { ReservationStatus } from "@/lib/reservation-manage";

/** 管理画面のボタン・入力欄・ステータス表示の共通スタイル */
export const adminButton = {
  primary:
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] disabled:bg-[#B0B0B0] disabled:cursor-not-allowed transition-colors",
  secondary:
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors",
  danger:
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm text-[#FAFAF8] bg-[#B85C5C] hover:bg-[#A04C4C] disabled:bg-[#D0D0D0] disabled:cursor-not-allowed transition-colors",
};

export const adminInput =
  "w-full px-3 py-2 text-sm bg-white border border-[#E5E4DF] text-[#2C2C2C] focus:outline-none focus:border-[#5C6B5C]";

export const STATUS_BADGE: Record<ReservationStatus, string> = {
  pending: "text-[#8A6A2F] bg-[#FBF5E8] border-[#E8D9B5]",
  confirmed: "text-[#5C6B5C] bg-[#EEF2EE] border-[#C9D3C9]",
  cancelled: "text-[#8A8A8A] bg-[#F2F2F0] border-[#E0E0DC]",
};
