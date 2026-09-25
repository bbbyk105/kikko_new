import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PageHero from "@/app/components/section/PageHero";
import ReserveForm from "@/app/components/reserve/ReserveForm";
import ReserveContactInfo from "@/app/components/reserve/ReserveContactInfo";
import { BulletList } from "@/app/components/ui/bullet-list";
import { reserveData } from "@/app/data/site";

export const metadata: Metadata = {
  title: "ご予約 | 橘香堂 (worx mt.fuji)",
  description:
    "橘香堂のご予約フォーム。ビジター利用、会議室予約、貸切利用を承ります。",
};

export default function ReservePage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Reserve"
          titleJa="ご予約"
          description="ご利用のご予約を承ります。"
        />

        {/* Reserve Form Section */}
        <section className="py-12 lg:py-16 bg-[#F7F6F3]">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <ReserveForm contactInfo={<ReserveContactInfo />} />
          </div>
        </section>

        {/* Notes */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-sm tracking-wider text-[#6B6B6B] mb-6 text-center">
                ご予約にあたって
              </h3>
              <BulletList items={reserveData.notes} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
