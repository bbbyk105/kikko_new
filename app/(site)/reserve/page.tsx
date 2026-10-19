import type { Metadata } from "next";
import PageHero from "@/app/components/section/PageHero";
import ReserveFormFromUrl from "@/app/components/reserve/ReserveFormFromUrl";
import ReserveContactInfo from "@/app/components/reserve/ReserveContactInfo";
import { BulletList } from "@/app/components/ui/bullet-list";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import { reserveData, primaryActions } from "@/app/data/site";

export const metadata: Metadata = {
  title: "ご予約",
  description:
    "橘香堂のご予約フォーム。ビジター利用、会議室予約、貸切利用を承ります。",
  alternates: { canonical: "/reserve" },
};

export default function ReservePage() {
  return (
    <>
      <PageHero
        title="Reserve"
        titleJa="ご予約"
        description="ご利用のご予約を承ります。"
        breadcrumbs={[{ name: "Reserve", href: "/reserve" }]}
      />

      {/* Reserve Form Section */}
      <section className="py-12 lg:py-16 bg-[#F7F6F3]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <ReserveFormFromUrl contactInfo={<ReserveContactInfo />} />
        </div>
      </section>

      {/* Notes */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-sm tracking-wider text-[#6B6B6B] mb-6 text-center">
              ご予約にあたって
            </h2>
            <BulletList items={reserveData.notes} />
            <p className="mt-8 text-center">
              <ArrowLink href={primaryActions.mypage.href}>
                マイページでご予約を確認・キャンセルする
              </ArrowLink>
            </p>
            <div className="mt-12 pt-10 border-t border-[#E5E4DF] text-center">
              <p className="text-sm text-[#6B6B6B] mb-5">
                ご質問・ご相談のみの方は、お問い合わせフォームをご利用ください。
              </p>
              <ArrowLink href={primaryActions.contact.href}>お問い合わせフォームへ</ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
