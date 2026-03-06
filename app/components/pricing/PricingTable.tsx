import Link from "next/link";
import { Check, X } from "lucide-react";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  nameEn: string;
  price: string;
  unit: string;
  description: string;
  features: PlanFeature[];
  highlighted?: boolean;
}

interface PricingTableProps {
  plans: Plan[];
}

export default function PricingTable({ plans }: PricingTableProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
      {plans.map((plan) => (
        <article
          key={plan.id}
          className={`relative flex flex-col p-8 lg:p-10 ${
            plan.highlighted
              ? "bg-[#FAFAF8] border-2 border-[#5C6B5C]"
              : "bg-white border border-[#E5E4DF]"
          }`}
        >
          {plan.highlighted && (
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 text-xs tracking-wider text-[#FAFAF8] bg-[#5C6B5C]">
              RECOMMENDED
            </span>
          )}

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs tracking-wider text-[#6B6B6B] mb-1">
              {plan.nameEn}
            </p>
            <h3 className="text-xl font-medium text-[#2C2C2C] mb-4">
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="font-[var(--font-cormorant)] text-5xl text-[#2C2C2C]">
                {plan.price}
              </span>
              <span className="text-sm text-[#6B6B6B]">{plan.unit}</span>
            </div>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              {plan.description}
            </p>
          </div>

          {/* Features */}
          <ul className="flex-1 space-y-4 mb-8">
            {plan.features.map((feature) => (
              <li
                key={feature.text}
                className="flex items-start gap-3 text-sm"
              >
                {feature.included ? (
                  <Check className="w-4 h-4 text-[#5C6B5C] mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-[#D0D0D0] mt-0.5 flex-shrink-0" />
                )}
                <span
                  className={
                    feature.included ? "text-[#2C2C2C]" : "text-[#B0B0B0]"
                  }
                >
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/reserve"
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
  );
}
