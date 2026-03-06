import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PageHero from "@/app/components/section/PageHero";
import BottomCTA from "@/app/components/section/BottomCTA";
import PricingTable from "@/app/components/pricing/PricingTable";
import PricingNotes from "@/app/components/pricing/PricingNotes";
import { pricingPageData } from "@/app/data/site";

export const metadata: Metadata = {
  title: "料金プラン | 橘香堂 (worx mt.fuji)",
  description:
    "橘香堂の料金プラン。ビジター利用から法人契約まで、利用スタイルに合わせて選べるシンプルな料金体系。",
};

export default function PricingPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title={pricingPageData.intro.title}
          titleJa={pricingPageData.intro.titleJa}
          description={pricingPageData.intro.description}
        />

        {/* Intro */}
        <section className="pb-16 lg:pb-20">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <p className="max-w-2xl text-[#6B6B6B] leading-relaxed">
              {pricingPageData.intro.lead}
            </p>
          </div>
        </section>

        {/* Pricing Table */}
        <section className="py-16 lg:py-20 bg-[#F7F6F3]">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <PricingTable plans={pricingPageData.detailedPlans} />
          </div>
        </section>

        {/* Pricing Notes */}
        <PricingNotes notes={pricingPageData.notes} />

        {/* Bottom CTA */}
        <BottomCTA
          title="利用スタイルに合うプランをご案内します。"
          description="ご不明な点がございましたら、お気軽にお問い合わせください。"
          primaryButton={{ text: "ご予約", href: "/reserve" }}
          secondaryButton={{ text: "お問い合わせ", href: "/#contact" }}
        />
      </main>
      <Footer />
    </>
  );
}
