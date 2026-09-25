import PlanCard, { type Plan } from "@/app/components/pricing/PlanCard";

interface PricingTableProps {
  plans: Plan[];
}

/** 料金ページのプラン一覧（含まれない項目も薄く表示する） */
export default function PricingTable({ plans }: PricingTableProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-6">
      {plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} surface="warm" />
      ))}
    </div>
  );
}
