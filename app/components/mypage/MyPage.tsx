"use client";

import { useSearchParams } from "next/navigation";
import { cancelMyReservation } from "@/app/actions/customer";
import { primaryActions } from "@/app/data/site";
import { useMyPage } from "@/app/hooks/use-my-page";
import { MYPAGE_LOGIN_ERROR_PARAM, MYPAGE_LOGOUT_PATH } from "@/lib/routes";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import ManageLoading from "@/app/components/reserve/manage/ManageLoading";
import ReservationPanel from "@/app/components/reserve/manage/ReservationPanel";
import LoginForm from "./LoginForm";
import ReservationHistory from "./ReservationHistory";

/**
 * マイページ本体。未ログインならログインフォーム、ログイン中なら自分の予約の一覧とキャンセル。
 * ログイン・ログアウトは Route Handler（/mypage/login・/mypage/logout）が Cookie を付け外しして戻ってくる。
 */
export default function MyPage() {
  const state = useMyPage(useSearchParams().has(MYPAGE_LOGIN_ERROR_PARAM));

  if (state.status === "loading") return <ManageLoading />;
  if (state.status === "guest") return <LoginForm notice={state.error} />;

  const { email, upcoming, history } = state.data;

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#6B6B6B]">
        <p className="break-all">{email} でログイン中</p>
        <form method="post" action={MYPAGE_LOGOUT_PATH}>
          <button type="submit" className="underline underline-offset-2 hover:text-[#2C2C2C] transition-colors">
            ログアウト
          </button>
        </form>
      </div>

      <section className="space-y-8">
        <h2 className="text-sm tracking-wider text-[#6B6B6B]">これからのご予約</h2>
        {upcoming.length === 0 ? (
          <div className="bg-white border border-[#E5E4DF] p-8 text-center space-y-6">
            <p className="text-sm text-[#6B6B6B]">これからのご予約はありません。</p>
            <ArrowLink href={primaryActions.reserve.href}>新しく予約する</ArrowLink>
          </div>
        ) : (
          <ul className="space-y-16">
            {upcoming.map((reservation) => (
              <li key={reservation.id}>
                <ReservationPanel
                  reservation={reservation}
                  cancelAction={() => cancelMyReservation(reservation.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <ReservationHistory reservations={history} />
    </div>
  );
}
