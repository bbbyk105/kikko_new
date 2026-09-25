import Link from "next/link";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BlockLabel, CardTitle, LeadText } from "@/app/components/ui/typography";
import type { LinkAction } from "@/app/data/site";

export interface PlanFeature {
  text: string;
  /** false なら「含まれない」として薄く表示する */
  included?: boolean;
}

export interface Plan {
  id: string;
  nameEn: string;
  name: string;
  price: string;
  unit: string;
  description: string;
  features: (string | PlanFeature)[];
  highlighted?: boolean;
  cta?: LinkAction;
}

interface PlanCardProps {
  plan: Plan;
  /** カードを置く背景。warm（#F7F6F3）の上では白いカードにする */
  surface?: "base" | "warm";
  /** false ならボタンを出さない（スペース詳細の料金紹介など） */
  showCta?: boolean;
}

const toFeature = (feature: string | PlanFeature): PlanFeature =>
  typeof feature === "string" ? { text: feature, included: true } : feature;

/**
 * 料金プランのカード。
 * 親を grid にして並べると、subgrid で「見出し / 説明 / 特典 / ボタン」の行が
 * カード間で揃う（説明が1行でも3行でも、特典とボタンの開始位置が同じになる）。
 */
export default function PlanCard({ plan, surface = "base", showCta = true }: PlanCardProps) {
  const hasCta = showCta && !!plan.cta;
  const cardSurface = plan.highlighted
    ? cn("border-2 border-[#5C6B5C]", surface === "warm" ? "bg-[#FAFAF8]" : "bg-[#F7F6F3]")
    : cn("border border-[#E5E4DF]", surface === "warm" ? "bg-white" : "bg-[#FAFAF8]");

  return (
    <article
      className={cn(
        "relative grid grid-rows-subgrid gap-0 p-8 lg:p-10",
        hasCta ? "row-span-4" : "row-span-3",
        cardSurface,
      )}
    >
      {plan.highlighted && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 text-[9px] tracking-[0.2em] uppercase text-[#FAFAF8] bg-[#5C6B5C] whitespace-nowrap">
          Recommended
        </span>
      )}

      {/* Plan Header */}
      <div>
        <BlockLabel className="mb-3">{plan.nameEn}</BlockLabel>
        <CardTitle className="mb-5">{plan.name}</CardTitle>
        <p className="flex items-baseline gap-1">
          <span className="font-[var(--font-cormorant)] text-[2.75rem] text-[#2C2C2C] leading-none tracking-tight">
            {plan.price}
          </span>
          <span className="text-[12px] text-[#9A9A9A] tracking-[0.05em]">{plan.unit}</span>
        </p>
      </div>

      <LeadText className="mt-4 mb-8">{plan.description}</LeadText>

      {/* Features */}
      <ul className={cn("space-y-3.5", hasCta && "mb-10")}>
        {plan.features.map(toFeature).map((feature) => (
          <li
            key={feature.text}
            className={cn(
              "flex items-start gap-3 text-[13px] tracking-[0.02em]",
              feature.included === false ? "text-[#B0B0B0]" : "text-[#6B6B6B]",
            )}
          >
            {feature.included === false ? (
              <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#D0D0D0]" aria-hidden="true" />
            ) : (
              <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#5C6B5C]" aria-hidden="true" />
            )}
            <span>
              {feature.text}
              {feature.included === false && <span className="sr-only">（対象外）</span>}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA（行の下端に揃える） */}
      {hasCta && plan.cta && (
        <Link
          href={plan.cta.href}
          className={cn(
            "self-end block text-center py-3.5 text-[12px] tracking-[0.12em] transition-colors",
            plan.highlighted
              ? "text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D]"
              : "text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8]",
          )}
        >
          {plan.cta.label}
        </Link>
      )}
    </article>
  );
}
