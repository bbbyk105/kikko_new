import { useCallback, useState } from "react";
import type { ManagedReservation, ManageReservationResult } from "@/lib/reservation-manage";

/**
 * 表示中の予約をキャンセルできるようにする（予約確認リンク・マイページ共通）。
 * justCancelled はこの画面でキャンセルした直後だけ true（完了メッセージの表示用）。
 */
export function useCancelableReservation(
  initial: ManagedReservation,
  cancelAction: () => Promise<ManageReservationResult>,
) {
  const [reservation, setReservation] = useState(initial);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [justCancelled, setJustCancelled] = useState(false);

  const cancel = useCallback(async () => {
    setCancelling(true);
    setCancelError(null);
    try {
      const result = await cancelAction();
      if (result.ok) {
        setReservation(result.reservation);
        setJustCancelled(true);
      } else {
        setCancelError(result.error);
      }
    } catch {
      setCancelError("キャンセルの処理に失敗しました。しばらく経ってからお試しください。");
    } finally {
      setCancelling(false);
    }
  }, [cancelAction]);

  return { reservation, cancel, cancelling, cancelError, justCancelled };
}
