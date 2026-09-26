"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cancelManagedReservation } from "@/app/actions/reservation-manage";
import { primaryActions } from "@/app/data/site";
import { useManagedReservation } from "@/app/hooks/use-managed-reservation";
import { primaryButtonClass } from "../buttons";
import ManageLoading from "./ManageLoading";
import ReservationPanel from "./ReservationPanel";

/** マイページへの案内（リンクなし・リンクが正しくないとき） */
function MyPageGuide({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center space-y-8">
      {children}
      <Link href={primaryActions.mypage.href} className={`${primaryButtonClass} inline-block`}>
        マイページにログイン
      </Link>
    </div>
  );
}

/**
 * 予約確認ページの本体。予約受付メールのリンク（?id=&t=）で開いたら予約内容とキャンセル操作を出す。
 * リンクなしで開いたときは、マイページへ案内する。
 */
export default function ReservationManager() {
  const params = useSearchParams();
  const id = params.get("id");
  const token = params.get("t");

  if (!id || !token) {
    return (
      <MyPageGuide>
        <p className="text-sm text-[#6B6B6B] leading-relaxed">
          ご予約の確認・キャンセルは、予約受付メールに記載のリンクからお進みください。
          <br className="hidden sm:inline" />
          メールが見当たらない場合は、マイページにご予約時のメールアドレスでログインしてください。
        </p>
      </MyPageGuide>
    );
  }

  // リンクが変わったら読み込みからやり直す
  return <ManagedReservationView key={`${id}:${token}`} id={id} token={token} />;
}

function ManagedReservationView({ id, token }: { id: string; token: string }) {
  const result = useManagedReservation(id, token);
  const cancelAction = useCallback(() => cancelManagedReservation(id, token), [id, token]);

  if (!result) return <ManageLoading />;

  if (!result.ok) {
    return (
      <MyPageGuide>
        <p
          role="alert"
          className="p-4 bg-[#FDF2F2] border border-[#B85C5C] text-[#B85C5C] text-sm leading-relaxed text-left"
        >
          {result.error}
        </p>
      </MyPageGuide>
    );
  }

  return <ReservationPanel reservation={result.reservation} cancelAction={cancelAction} />;
}
