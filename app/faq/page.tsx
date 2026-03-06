import type { Metadata } from "next";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import PageHero from "@/app/components/section/PageHero";
import BottomCTA from "@/app/components/section/BottomCTA";
import FaqAccordion from "@/app/components/faq/FaqAccordion";
import { faqItems } from "@/app/data/site";

export const metadata: Metadata = {
  title: "よくあるご質問 | 橘香堂 (worx mt.fuji)",
  description:
    "橘香堂のよくあるご質問。ビジター利用、会員プラン、イベント利用、住所登録サービスなどについてお答えします。",
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title="FAQ"
          titleJa="よくあるご質問"
          description="ご利用前によくいただくご質問をまとめました。"
        />

        {/* FAQ Section */}
        <section className="pb-24 lg:pb-32">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <FaqAccordion items={faqItems} />
          </div>
        </section>

        {/* Bottom CTA */}
        <BottomCTA
          title="解決しない場合は、お気軽にお問い合わせください。"
          description="スタッフが丁寧にご対応いたします。"
          primaryButton={{ text: "お問い合わせ", href: "/#contact" }}
          secondaryButton={{ text: "ご予約", href: "/reserve" }}
        />
      </main>
      <Footer />
    </>
  );
}
