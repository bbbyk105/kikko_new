import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BottomCTA from "@/app/components/section/BottomCTA";
import SectionIntro from "@/app/components/section/SectionIntro";
import BookingSteps from "@/app/components/section/BookingSteps";
import FaqAccordion from "@/app/components/faq/FaqAccordion";
import SpaceDetailHero from "@/app/components/space/SpaceDetailHero";
import SpaceOverview from "@/app/components/space/SpaceOverview";
import SpaceHighlights from "@/app/components/space/SpaceHighlights";
import SpaceScenes from "@/app/components/space/SpaceScenes";
import SpacePlans from "@/app/components/space/SpacePlans";
import SpaceOtherTypes from "@/app/components/space/SpaceOtherTypes";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import { spaceCategories, spaceDetails, pricingPlans, faqItems } from "@/app/data/site";

interface SpaceDetailPageProps {
  params: Promise<{ slug: string }>;
}

// dynamicParams = false にすると OpenNext（incremental cache 未設定）で全件 404 になるため付けない。
// 未知の slug は getSpace() → notFound() で 404 になる。
export function generateStaticParams() {
  return spaceCategories.map((category) => ({ slug: category.id }));
}

function getSpace(slug: string) {
  const category = spaceCategories.find((c) => c.id === slug);
  const detail = spaceDetails[slug];
  if (!category || !detail) return null;
  return { category, detail };
}

export async function generateMetadata({ params }: SpaceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const space = getSpace(slug);
  if (!space) return {};

  const { category } = space;
  return {
    title: category.seoTitle,
    description: `富士市吉原の橘香堂の${category.titleJa}。${category.description}`,
    alternates: { canonical: `/space/${category.id}` },
  };
}

export default async function SpaceDetailPage({ params }: SpaceDetailPageProps) {
  const { slug } = await params;
  const space = getSpace(slug);
  if (!space) notFound();

  const { category, detail } = space;
  const plans = pricingPlans.filter((plan) => detail.planIds.includes(plan.id));
  const faqs = faqItems.filter((item) => detail.faqIds.includes(item.id));
  const otherCategories = spaceCategories.filter((c) => c.id !== category.id);

  return (
    <>
      <SpaceDetailHero
        slug={category.id}
        number={category.number}
        title={category.title}
        titleJa={category.titleJa}
        description={category.description}
        image={category.image}
      />

      <SpaceOverview
        catchcopy={detail.catchcopy}
        intro={detail.intro}
        facts={detail.facts}
      />

      <SpaceHighlights titleJa={category.titleJa} highlights={detail.highlights} />

      <SpaceScenes scenes={detail.scenes} recommendedFor={detail.recommendedFor} />

      <SpacePlans plans={plans} note={detail.pricingNote} estimateHref={detail.estimateHref} />

      {/* Flow */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <SectionIntro label="Flow" title="ご利用の流れ" />
          <BookingSteps steps={detail.flow} />
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 lg:py-28 bg-[#F7F6F3]">
          <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
            <SectionIntro label="FAQ" title="よくあるご質問" centered />
            <FaqAccordion items={faqs} />
            <div className="mt-12 text-center">
              <ArrowLink href="/faq">すべての質問を見る</ArrowLink>
            </div>
          </div>
        </section>
      )}

      <SpaceOtherTypes categories={otherCategories} />

      <BottomCTA
        title={detail.cta.title}
        description={detail.cta.description}
        primaryButton={detail.cta.primaryButton}
        secondaryButton={detail.cta.secondaryButton}
      />
    </>
  );
}
