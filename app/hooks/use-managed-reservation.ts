import { useEffect, useState } from "react";
import { getManagedReservation } from "@/app/actions/reservation-manage";
import type { ManageReservationResult } from "@/lib/reservation-manage";

const LOAD_ERROR: ManageReservationResult = {
  ok: false,
  error: "ご予約の読み込みに失敗しました。しばらく経ってからお試しください。",
};

/**
 * 予約確認リンク（id・署名）の予約を読み込む。
 * 戻り値が null の間は読み込み中（effect 内で loading を setState しないため）。
 */
export function useManagedReservation(id: string, token: string) {
  const [result, setResult] = useState<ManageReservationResult | null>(null);

  useEffect(() => {
    let ignore = false;
    getManagedReservation(id, token)
      .then((res) => {
        if (!ignore) setResult(res);
      })
      .catch(() => {
        if (!ignore) setResult(LOAD_ERROR);
      });
    return () => {
      ignore = true;
    };
  }, [id, token]);

  return result;
}
