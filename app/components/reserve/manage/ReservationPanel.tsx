"use client";

import { useCancelableReservation } from "@/app/hooks/use-cancelable-reservation";
import type { ManagedReservation, ManageReservationResult } from "@/lib/reservation-manage";
import CancelSection from "./CancelSection";
import ReservationDetails from "./ReservationDetails";

interface ReservationPanelProps {
  reservation: ManagedReservation;
  /** キャンセルを実行するサーバーアクション（予約確認リンク用・マイページ用で異なる） */
  cancelAction: () => Promise<ManageReservationResult>;
}

/** 予約内容とキャンセル操作 */
export default function ReservationPanel({ reservation: initial, cancelAction }: ReservationPanelProps) {
  const { reservation, cancel, cancelling, cancelError, justCancelled } = useCancelableReservation(
    initial,
    cancelAction,
  );

  return (
    <div className="space-y-10">
      <ReservationDetails reservation={reservation} />
      <CancelSection
        reservation={reservation}
        onCancel={cancel}
        cancelling={cancelling}
        error={cancelError}
        justCancelled={justCancelled}
      />
    </div>
  );
}
