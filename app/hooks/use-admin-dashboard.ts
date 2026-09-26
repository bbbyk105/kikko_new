import { useCallback, useEffect, useState } from "react";
import { getAdminDashboard, type AdminDashboardResult } from "@/app/actions/admin-reservations";
import type { AdminView } from "@/lib/admin-reservations";

type Result = { key: string; data: AdminDashboardResult };

/**
 * 管理画面の一覧をサーバーアクションから読む。
 * - 結果がどのビュー・何回目の読み込みのものかを持ち、今と違えば読み込み中とみなす
 * - 読み込み中は前の結果を表示したままにする
 */
export function useAdminDashboard(view: AdminView) {
  const [reloadCount, setReloadCount] = useState(0);
  const key = `${view}:${reloadCount}`;
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let ignore = false;
    getAdminDashboard(view)
      .then((data) => {
        if (!ignore) setResult({ key, data });
      })
      .catch(() => {
        if (!ignore) setResult({ key, data: { ok: false, reason: "error" } });
      });
    return () => {
      ignore = true;
    };
  }, [key, view]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  return { data: result?.data ?? null, loading: result?.key !== key, reload };
}
