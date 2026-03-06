import Link from "next/link";
import { pricingPlans } from "@/app/data/site";

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-32 lg:py-40"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-6">
            PRICING
          </p>
          <h2
            id="pricing-heading"
            className="font-[var(--font-cormorant)] text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wide text-[#2C2C2C] mb-6"
          >
            シンプルな料金体系。
          </h2>
          <p className="text-[#6B6B6B] leading-relaxed">
            ご利用スタイルに合わせて、
            <br className="sm:hidden" />
            最適なプランをお選びいただけます。
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
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
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 text-xs tracking-wider text-[#FAFAF8] bg-[#5C6B5C]">
                  RECOMMENDED
                </span>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <p className="text-xs tracking-wider text-[#6B6B6B] mb-2">
                  {plan.nameEn}
                </p>
                <h3 className="text-xl font-medium text-[#2C2C2C] mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="font-[var(--font-cormorant)] text-4xl text-[#2C2C2C]">
                    {plan.price}
                  </span>
                  <span className="text-sm text-[#6B6B6B]">{plan.unit}</span>
                </div>
                <p className="text-sm text-[#6B6B6B] mt-3">{plan.description}</p>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[#6B6B6B]"
                  >
                    <svg
                      className="w-4 h-4 text-[#5C6B5C] mt-0.5 flex-shrink-0"
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
                href="#contact"
                className={`block text-center py-3 text-sm tracking-wider transition-colors ${
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
        <p className="text-center text-sm text-[#8A8A8A] mt-12">
          ※ 価格はすべて税込表示です。詳細はお気軽にお問い合わせください。
        </p>
      </div>
    </section>
  );
}
