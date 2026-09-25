import type { Metadata } from "next";
import PageHero from "@/app/components/section/PageHero";
import BottomCTA from "@/app/components/section/BottomCTA";
import FaqAccordion from "@/app/components/faq/FaqAccordion";
import { faqItems, primaryActions } from "@/app/data/site";

export const metadata: Metadata = {
  title: "よくあるご質問",
  description:
    "橘香堂のよくあるご質問。ビジター利用、会員プラン、イベント利用、住所登録サービスなどについてお答えします。",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="FAQ"
        titleJa="よくあるご質問"
        description="ご利用前によくいただくご質問をまとめました。"
        breadcrumbs={[{ name: "FAQ", href: "/faq" }]}
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
        primaryButton={{ text: primaryActions.contact.label, href: primaryActions.contact.href }}
        secondaryButton={{ text: primaryActions.reserve.label, href: primaryActions.reserve.href }}
      />
    </>
  );
}
