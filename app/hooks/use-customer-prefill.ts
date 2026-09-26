import { useEffect } from "react";
import { getCustomerProfile, type CustomerProfile } from "@/app/actions/customer";

/** マイページにログイン中なら、お名前・メールアドレスなどを予約フォームに入れる（apply は useCallback で固定する） */
export function useCustomerPrefill(apply: (profile: CustomerProfile) => void) {
  useEffect(() => {
    let ignore = false;
    getCustomerProfile()
      .then((profile) => {
        if (!ignore && profile) apply(profile);
      })
      .catch(() => {
        // 自動入力できなくても予約はできるので何もしない
      });
    return () => {
      ignore = true;
    };
  }, [apply]);
}
