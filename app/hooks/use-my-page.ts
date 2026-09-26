import { useEffect, useState } from "react";
import { getMyReservations, type MyReservationsResult } from "@/app/actions/customer";

type MyPageData = Extract<MyReservationsResult, { ok: true }>;

export type MyPageState =
  | { status: "loading" }
  | { status: "guest"; error?: string }
  | { status: "ready"; data: MyPageData };

const LOAD_ERROR = "ご予約の読み込みに失敗しました。しばらく経ってからお試しください。";
const LOGIN_LINK_ERROR =
  "ログイン用リンクの有効期限が切れているか、正しくありません。もう一度ログイン用リンクをお送りください。";

/**
 * マイページの状態。未ログインなら guest（ログインフォームを出す）。
 * loginFailed はログイン用リンクが無効でマイページへ戻されたとき true。
 */
export function useMyPage(loginFailed: boolean) {
  const [state, setState] = useState<MyPageState>({ status: "loading" });

  useEffect(() => {
    let ignore = false;
    getMyReservations()
      .then((result) => {
        if (ignore) return;
        if (result.ok) {
          setState({ status: "ready", data: result });
        } else {
          const error =
            result.reason === "error" ? LOAD_ERROR : loginFailed ? LOGIN_LINK_ERROR : undefined;
          setState({ status: "guest", error });
        }
      })
      .catch(() => {
        if (!ignore) setState({ status: "guest", error: LOAD_ERROR });
      });
    return () => {
      ignore = true;
    };
  }, [loginFailed]);

  return state;
}
