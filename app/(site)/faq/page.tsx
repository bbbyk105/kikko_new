import type { Metadata } from "next";
import PageHero from "@/app/components/section/PageHero";
import BottomCTA from "@/app/components/section/BottomCTA";
import FaqAccordion from "@/app/components/faq/FaqAccordion";
import { brandWithReading, faqItems, primaryActions } from "@/app/data/site";
import { JsonLd } from "@/app/components/seo/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { faqStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata(
  "/faq",
  "よくあるご質問",
  `富士市吉原の${brandWithReading}のよくあるご質問。営業時間、ビジター利用、会員プラン、イベント利用、住所登録についてお答えします。`,
);

export default function FaqPage() {
  return (
    <>
      <PageHero
        title="FAQ"
        titleJa="よくあるご質問"
        description="ご利用前によくいただくご質問をまとめました。"
        breadcrumbs={[{ name: "FAQ", href: "/faq", structuredName: "よくある質問" }]}
      />

      {/* FAQ Section */}
      <section className="pb-24 lg:pb-32">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <FaqAccordion items={faqItems} />
        </div>
      </section>

      <BottomCTA
        title="解決しない場合は、お気軽にお問い合わせください。"
        description="スタッフが丁寧にご対応いたします。"
        primaryButton={{ text: primaryActions.contact.label, href: primaryActions.contact.href }}
        secondaryButton={{ text: primaryActions.reserve.label, href: primaryActions.reserve.href }}
      />
      <JsonLd data={faqStructuredData(faqItems)} />
    </>
  );
}
