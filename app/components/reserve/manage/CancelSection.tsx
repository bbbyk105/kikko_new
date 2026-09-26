"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { primaryActions, siteConfig } from "@/app/data/site";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import type { ManagedReservation } from "@/lib/reservation-manage";
import { secondaryButtonClass } from "../buttons";

interface CancelSectionProps {
  reservation: ManagedReservation;
  onCancel: () => void;
  cancelling: boolean;
  error: string | null;
  /** この画面でキャンセルした直後か */
  justCancelled: boolean;
}

const phoneLink = (
  <a
    href={`tel:${siteConfig.phone}`}
    className="whitespace-nowrap text-[#2C2C2C] underline underline-offset-2 hover:text-[#5C6B5C] transition-colors"
  >
    {siteConfig.phone}
  </a>
);

/** 予約確認ページのキャンセル操作。締切・状態に応じて表示を切り替える */
export default function CancelSection({
  reservation: r,
  onCancel,
  cancelling,
  error,
  justCancelled,
}: CancelSectionProps) {
  const [confirming, setConfirming] = useState(false);

  switch (r.cancelState) {
    case "cancelled":
      return (
        <div className="text-center">
          {justCancelled ? (
            <div role="status" className="bg-white border border-[#E5E4DF] p-8 mb-10">
              <CheckCircle className="w-10 h-10 mx-auto mb-4 text-[#5C6B5C]" strokeWidth={1} />
              <p className="text-[#2C2C2C] font-medium mb-2">キャンセルを承りました</p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                ご登録のメールアドレスに、確認のメールをお送りしました。
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#6B6B6B] mb-8">このご予約はキャンセル済みです。</p>
          )}
          <ArrowLink href={primaryActions.reserve.href}>新しく予約する</ArrowLink>
        </div>
      );

    case "past":
      return <p className="text-sm text-[#6B6B6B] text-center">ご利用日を過ぎたご予約です。</p>;

    case "closed":
      return (
        <p className="text-sm text-[#6B6B6B] text-center leading-relaxed">
          Web でのキャンセル受付は {r.cancelDeadlineLabel} で終了しました。
          <br />
          キャンセルや日時の変更は、お電話（{phoneLink}）でご連絡ください。
        </p>
      );

    case "cancellable":
      if (!confirming) {
        return (
          <div className="text-center">
            <p className="text-sm text-[#6B6B6B] mb-6">
              Web でのキャンセルは {r.cancelDeadlineLabel} まで承ります。
            </p>
            <button type="button" onClick={() => setConfirming(true)} className={secondaryButtonClass}>
              このご予約をキャンセルする
            </button>
          </div>
        );
      }
      return (
        <div className="bg-white border border-[#B85C5C] p-6 sm:p-8 text-center">
          <p className="text-[#2C2C2C] font-medium mb-2">このご予約をキャンセルしますか？</p>
          <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
            キャンセルすると元に戻せません。
            <br className="hidden sm:inline" />
            あらためてご利用の際は、もう一度ご予約ください。
          </p>

          {error && (
            <p role="alert" className="mb-6 p-4 bg-[#FDF2F2] border border-[#B85C5C] text-[#B85C5C] text-sm">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={cancelling}
              className={secondaryButtonClass}
            >
              戻る
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={cancelling}
              className="px-8 py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#B85C5C] hover:bg-[#A04C4C] disabled:bg-[#D0D0D0] disabled:cursor-not-allowed transition-colors"
            >
              {cancelling ? "処理中..." : "キャンセルを確定する"}
            </button>
          </div>
        </div>
      );
  }
}
