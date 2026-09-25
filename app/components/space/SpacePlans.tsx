import { Check } from "lucide-react";
import SectionIntro from "@/app/components/section/SectionIntro";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import { BlockLabel, CardTitle, LeadText } from "@/app/components/ui/typography";

interface Plan {
  id: string;
  name: string;
  nameEn: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
}

interface SpacePlansProps {
  plans: Plan[];
  note: string;
}

export default function SpacePlans({ plans, note }: SpacePlansProps) {
  const hasPlans = plans.length > 0;

  return (
    <section className="py-20 lg:py-28 bg-[#F7F6F3]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <SectionIntro label="Pricing" title="料金" description={note} />

        {hasPlans && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mb-12">
            {plans.map((plan) => (
              <article key={plan.id} className="p-8 lg:p-10 bg-[#FAFAF8] border border-[#E5E4DF]">
                <BlockLabel className="mb-3">{plan.nameEn}</BlockLabel>
                <CardTitle className="mb-5">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="font-[var(--font-cormorant)] text-[2.75rem] text-[#2C2C2C] leading-none tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-[12px] text-[#9A9A9A] tracking-[0.05em]">{plan.unit}</span>
                </div>
                <LeadText className="mt-4 mb-8">{plan.description}</LeadText>
                <ul className="space-y-3.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-[13px] tracking-[0.02em] text-[#6B6B6B]"
                    >
                      <Check
                        className="w-3.5 h-3.5 text-[#5C6B5C] mt-0.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {hasPlans ? (
            <ArrowLink href="/pricing">料金プランをすべて見る</ArrowLink>
          ) : (
            <ArrowLink href="/contact">お見積りを依頼する</ArrowLink>
          )}
        </div>
        {hasPlans && (
          <p className="text-[12px] tracking-[0.03em] text-[#9A9A9A] mt-8">
            ※ 価格はすべて税込表示です。
          </p>
        )}
      </div>
    </section>
  );
}
