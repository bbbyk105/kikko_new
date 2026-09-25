import Link from "next/link";
import { pricingPlans } from "@/app/data/site";
import { contactHref } from "@/lib/routes";
import { SectionHeader } from "@/app/components/ui/typography";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import PlanCard from "@/app/components/pricing/PlanCard";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-36 lg:py-48"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          eyebrow="Pricing"
          title="シンプルな料金体系。"
          description="ご利用スタイルに合わせて、最適なプランをお選びいただけます。"
          align="center"
          titleId="pricing-heading"
          size="large"
        />

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {pricingPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-[12px] tracking-[0.03em] text-[#9A9A9A] mt-14">
          ※ 価格はすべて税込表示です。ご不明な点は
          <Link
            href={contactHref()}
            className="underline underline-offset-4 decoration-[#C8C7C2] hover:text-[#2C2C2C] transition-colors"
          >
            お問い合わせ
          </Link>
          ください。
        </p>

        <div className="mt-12 text-center">
          <ArrowLink href="/pricing">料金プランの詳細を見る</ArrowLink>
        </div>
      </div>
    </section>
  );
}
