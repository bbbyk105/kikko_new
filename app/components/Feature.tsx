import { features } from "@/app/data/site";
import { featureFigures, type FeatureFigureId } from "@/app/components/feature/FeatureFigures";
import { InView } from "@/app/components/feature/InView";
import { cn } from "@/lib/utils";
import { SectionHeader, CardTitle, DecorativeNumber, LeadText } from "@/app/components/ui/typography";
import { ArrowLink } from "@/app/components/ui/arrow-link";

/**
 * 設備ごとの製図風イラスト（写真の使い回しをやめ、項目ごとに別の図を見せる）。
 * 画面に入ると線が描き出され、そのあと一部の部品が動き続ける
 */
function FigureCard({ id, className }: { id: string; className?: string }) {
  const Figure = featureFigures[id as FeatureFigureId];
  if (!Figure) return null;
  return (
    <InView className={cn("bg-white border border-[#E5E4DF] p-3 sm:p-5 transition-colors", className)}>
      <Figure />
    </InView>
  );
}

export default function Feature() {
  return (
    <section
      className="py-36 lg:py-48"
      aria-labelledby="feature-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          eyebrow="Features"
          title={
            <>
              <span className="block">仕事を支える、</span>
              <span className="block">充実の設備。</span>
            </>
          }
          titleId="feature-heading"
          size="large"
        />

        {/* Feature Grid - Asymmetric Layout */}
        <div className="space-y-28 lg:space-y-40">
          {/* Feature 1 - Large Left */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <FigureCard id={features[0].id} />
            </div>
            <div className="lg:col-span-5 lg:pl-4">
              <DecorativeNumber size="large" className="block mb-5">01</DecorativeNumber>
              <CardTitle className="mb-5">{features[0].title}</CardTitle>
              <LeadText>{features[0].description}</LeadText>
            </div>
          </div>

          {/* Feature 2 - Large Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 lg:pr-4 order-2 lg:order-1">
              <DecorativeNumber size="large" className="block mb-5">02</DecorativeNumber>
              <CardTitle className="mb-5">{features[1].title}</CardTitle>
              <LeadText>{features[1].description}</LeadText>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <FigureCard id={features[1].id} />
            </div>
          </div>

          {/* Features 3 & 4 - Two Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-20">
            {features.slice(2).map((feature, index) => (
              <div key={feature.id} className="group">
                <FigureCard id={feature.id} className="mb-8 group-hover:border-[#C9C8C3]" />
                <DecorativeNumber className="block mb-4">0{index + 3}</DecorativeNumber>
                <CardTitle className="mb-4">{feature.title}</CardTitle>
                <LeadText>{feature.description}</LeadText>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 lg:mt-28 text-center">
          <ArrowLink href="/space#specs">設備・仕様の一覧を見る</ArrowLink>
        </div>
      </div>
    </section>
  );
}
