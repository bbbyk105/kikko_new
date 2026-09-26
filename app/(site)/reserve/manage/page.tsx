import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/app/components/section/PageHero";
import ManageLoading from "@/app/components/reserve/manage/ManageLoading";
import ReservationManager from "@/app/components/reserve/manage/ReservationManager";
import { BulletList } from "@/app/components/ui/bullet-list";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import { primaryActions, reserveData, siteConfig } from "@/app/data/site";
import { RESERVE_MANAGE_PATH } from "@/lib/routes";

export const metadata: Metadata = {
  title: "ご予約の確認・キャンセル",
  description: "予約受付メールのリンクから、ご予約内容の確認とキャンセルができます。",
  robots: { index: false, follow: true },
};

export default function ReserveManagePage() {
  return (
    <>
      <PageHero
        title="My Reservation"
        titleJa="ご予約の確認・キャンセル"
        description="予約受付メールのリンクから、ご予約内容の確認とキャンセルができます。"
        breadcrumbs={[
          { name: "Reserve", href: primaryActions.reserve.href },
          { name: "My Reservation", href: RESERVE_MANAGE_PATH },
        ]}
      />

      <section className="py-12 lg:py-16 bg-[#F7F6F3]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* ?id=&t= はブラウザ側で読む。ページを静的なままにし、Workers の CPU を使わないため */}
            <Suspense fallback={<ManageLoading />}>
              <ReservationManager />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-sm tracking-wider text-[#6B6B6B] mb-6 text-center">
              キャンセル・変更について
            </h2>
            <BulletList items={reserveData.manageNotes} />
            <div className="mt-12 pt-10 border-t border-[#E5E4DF] text-center">
              <p className="text-sm text-[#6B6B6B] mb-5">
                お電話でのお問い合わせ{" "}
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="text-[#2C2C2C] hover:text-[#5C6B5C] transition-colors"
                >
                  {siteConfig.phone}
                </a>
                （{siteConfig.hours.regular}）
              </p>
              <ArrowLink href={primaryActions.reserve.href}>新しく予約する</ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
