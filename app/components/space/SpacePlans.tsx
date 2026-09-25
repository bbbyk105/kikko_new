import SectionIntro from "@/app/components/section/SectionIntro";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import PlanCard, { type Plan } from "@/app/components/pricing/PlanCard";
import { contactHref } from "@/lib/routes";

interface SpacePlansProps {
  plans: Plan[];
  note: string;
  /** プランが無いときの「お見積りを依頼する」の行き先 */
  estimateHref?: string;
}

export default function SpacePlans({ plans, note, estimateHref = contactHref() }: SpacePlansProps) {
  const hasPlans = plans.length > 0;

  return (
    <section className="py-20 lg:py-28 bg-[#F7F6F3]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <SectionIntro label="Pricing" title="料金" description={note} />

        {hasPlans && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-4xl mb-12">
            {/* ここでは紹介だけ。予約・相談のボタンはページ下部の CTA にまとめる */}
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={{ ...plan, highlighted: false }} surface="warm" showCta={false} />
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {hasPlans ? (
            <ArrowLink href="/pricing">料金プランをすべて見る</ArrowLink>
          ) : (
            <ArrowLink href={estimateHref}>お見積りを依頼する</ArrowLink>
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
