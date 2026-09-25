import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { faqItems } from "@/app/data/site";
import { SectionHeader } from "@/app/components/ui/typography";
import FaqToggleList from "@/app/components/faq/FaqToggleList";

const displayFaqItems = faqItems.slice(0, 5);

/** トップページの FAQ セクション（開閉する一覧だけ Client Component） */
export default function Faq() {
  return (
    <section id="faq" className="py-36 lg:py-48 bg-[#FAFAF8]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          eyebrow="FAQ"
          title="よくある質問"
          description="ご利用にあたってよくいただくご質問をまとめました"
          align="center"
          titleId="faq-heading"
        />

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          <FaqToggleList items={displayFaqItems} defaultOpenId={displayFaqItems[0]?.id} />
        </div>

        {/* View All Link */}
        <div className="text-center mt-14">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.1em] text-[#5C6B5C] hover:text-[#2C2C2C] transition-colors"
          >
            <span>すべての質問を見る</span>
            <ArrowRight className="w-3 h-3" strokeWidth={1.5} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
