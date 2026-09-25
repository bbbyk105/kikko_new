import { BulletList } from "@/app/components/ui/bullet-list";

interface PricingNotesProps {
  notes: string[];
}

export default function PricingNotes({ notes }: PricingNotesProps) {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-sm tracking-wider text-[#6B6B6B] mb-6">
            ご利用にあたって
          </h2>
          <BulletList items={notes} />
        </div>
      </div>
    </section>
  );
}
