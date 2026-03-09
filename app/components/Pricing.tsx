import Link from "next/link";
import { pricingPlans } from "@/app/data/site";
import { SectionHeader, CardTitle, BlockLabel, LeadText } from "@/app/components/ui/typography";

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
            <article
              key={plan.id}
              className={`relative p-8 lg:p-10 ${
                plan.highlighted
                  ? "bg-[#F7F6F3] border-2 border-[#5C6B5C]"
                  : "bg-[#FAFAF8] border border-[#E5E4DF]"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 text-[9px] tracking-[0.2em] uppercase text-[#FAFAF8] bg-[#5C6B5C]">
                  Recommended
                </span>
              )}

              {/* Plan Header */}
              <div className="mb-10">
                <BlockLabel className="mb-3">{plan.nameEn}</BlockLabel>
                <CardTitle className="mb-5">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="font-[var(--font-cormorant)] text-[2.75rem] text-[#2C2C2C] leading-none tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-[12px] text-[#9A9A9A] tracking-[0.05em]">{plan.unit}</span>
                </div>
                <LeadText className="mt-4">{plan.description}</LeadText>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 mb-10">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-[13px] tracking-[0.02em] text-[#6B6B6B]"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-[#5C6B5C] mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/contact"
                className={`block text-center py-3.5 text-[12px] tracking-[0.12em] transition-colors ${
                  plan.highlighted
                    ? "text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D]"
                    : "text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8]"
                }`}
              >
                お問い合わせ
              </Link>
            </article>
          ))}
        </div>

        {/* Note */}
        <p className="text-center text-[12px] tracking-[0.03em] text-[#9A9A9A] mt-14">
          ※ 価格はすべて税込表示です。詳細はお気軽にお問い合わせください。
        </p>
      </div>
    </section>
  );
}
